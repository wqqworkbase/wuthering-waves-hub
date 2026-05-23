import fs from 'fs'
import path from 'path'

const CONTENT = path.join(__dirname, '..', 'content')
const RAW = path.join(CONTENT, 'raw-pages')
const IMG_OUT = path.join(CONTENT, 'images')

interface RawPage { title: string; images: string[] }

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url)
    if (!res.ok) return false
    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(dest, buffer)
    return true
  } catch {
    return false
  }
}

async function main() {
  const categories = ['characters', 'weapons', 'echoes', 'quests']

  const allImages = new Map<string, string>()

  for (const cat of categories) {
    const dir = path.join(RAW, cat)
    if (!fs.existsSync(dir)) continue

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
    for (const file of files) {
      const raw: RawPage = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
      const slug = file.replace('.json', '')
      for (const imgUrl of raw.images) {
        const ext = imgUrl.match(/\.(png|jpg|jpeg|webp|gif)/i)?.[0] ?? '.png'
        const localName = `${cat}/${slug}${allImages.size}${ext}`
        allImages.set(imgUrl, localName)
      }
    }
  }

  console.log(`Downloading ${allImages.size} unique images...`)

  let downloaded = 0
  for (const [url, localName] of allImages) {
    const dest = path.join(IMG_OUT, localName)
    fs.mkdirSync(path.dirname(dest), { recursive: true })

    if (fs.existsSync(dest)) { downloaded++; continue }

    console.log(`  [${downloaded + 1}/${allImages.size}] ${path.basename(localName)}`)
    const ok = await downloadImage(url, dest)
    if (ok) downloaded++
    await new Promise(r => setTimeout(r, 150))
  }

  console.log(`Downloaded ${downloaded} images`)

  // Try WebP conversion via sharp if available
  try {
    console.log('Converting to WebP...')
    const sharp = await import('sharp')
    for (const [, localName] of allImages) {
      const src = path.join(IMG_OUT, localName)
      if (!fs.existsSync(src)) continue
      const dest = src.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp')
      if (fs.existsSync(dest)) continue
      try {
        await sharp.default(src).webp({ quality: 85 }).toFile(dest)
      } catch { /* skip unconvertible images */ }
    }
  } catch { console.log('sharp not available, skipping WebP conversion') }
}

main().catch(console.error)
