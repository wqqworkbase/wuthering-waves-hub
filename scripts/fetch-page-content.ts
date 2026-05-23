import fs from 'fs'
import path from 'path'

const API = 'https://wutheringwaves.fandom.com/api.php'
const CONTENT = path.join(__dirname, '..', 'content')
const OUTPUT = path.join(CONTENT, 'raw-pages')

interface PageContent {
  title: string
  html: string
  images: string[]
  infobox: Record<string, string>
}

function parseInfobox(html: string): Record<string, string> {
  const data: Record<string, string> = {}
  const rowRegex = /<tr[^>]*>.*?<th[^>]*>(.*?)<\/th>.*?<td[^>]*>(.*?)<\/td>.*?<\/tr>/gs
  let match: RegExpExecArray | null
  while ((match = rowRegex.exec(html)) !== null) {
    const key = match[1].replace(/<[^>]+>/g, '').trim()
    const value = match[2].replace(/<[^>]+>/g, '').trim()
    if (key && value) data[key] = value
  }
  return data
}

function extractImages(html: string): string[] {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
  const images: string[] = []
  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1]
    if (src.includes('static.wikia.nocookie.net') && !src.includes('data:image')) {
      images.push(src.split('/revision/')[0])
    }
  }
  return [...new Set(images)]
}

async function fetchPage(title: string): Promise<PageContent> {
  const params = new URLSearchParams({
    action: 'parse', page: title, format: 'json',
    prop: 'text|images', disablelimitreport: '1',
  })

  const res = await fetch(`${API}?${params}`)
  const data = await res.json()

  const html: string = data.parse?.text?.['*'] ?? ''
  const images: string[] = data.parse?.images ?? []

  return {
    title,
    html,
    images: [
      ...images
        .filter((i: string) => !i.endsWith('.svg') || i.includes('Icon'))
        .map((i: string) => `https://wutheringwaves.fandom.com/wiki/Special:FilePath/${encodeURIComponent(i)}`),
      ...extractImages(html),
    ],
    infobox: parseInfobox(html),
  }
}

async function main() {
  const lists = JSON.parse(fs.readFileSync(path.join(CONTENT, 'page-lists.json'), 'utf-8'))
  fs.mkdirSync(OUTPUT, { recursive: true })

  const categories = ['characters', 'weapons', 'echoes', 'quests'] as const
  for (const cat of categories) {
    console.log(`Fetching ${cat} pages...`)
    const dir = path.join(OUTPUT, cat)
    fs.mkdirSync(dir, { recursive: true })

    for (const title of lists[cat]) {
      const safeName = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      const filePath = path.join(dir, `${safeName}.json`)

      if (fs.existsSync(filePath)) {
        console.log(`  Skip ${title} (cached)`)
        continue
      }

      try {
        console.log(`  Fetching ${title}...`)
        const content = await fetchPage(title)
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
        await new Promise(r => setTimeout(r, 200))
      } catch (err) {
        console.error(`  Failed ${title}: ${err}`)
      }
    }
  }
  console.log('Done fetching pages')
}

main().catch(console.error)
