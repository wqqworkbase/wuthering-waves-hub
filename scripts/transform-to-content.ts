import fs from 'fs'
import path from 'path'

const CONTENT = path.join(__dirname, '..', 'content')
const RAW = path.join(CONTENT, 'raw-pages')

interface RawPage {
  title: string
  html: string
  images: string[]
  infobox: Record<string, string>
}

function extractCharacterFM(raw: RawPage) {
  const ib = raw.infobox
  return {
    slug: raw.title.toLowerCase().replace(/[\/\s]+/g, '-'),
    name: raw.title,
    element: ib['Element'] ?? ib['Attribute'] ?? 'Unknown',
    weaponType: ib['Weapon'] ?? ib['Weapon Type'] ?? 'Unknown',
    rarity: parseInt(ib['Rarity']?.replace(/[^0-9]/g, '') ?? '5') || 5,
    role: ib['Role'] ?? ib['Class'] ?? 'Main DPS',
    image: '',
    splashArt: '',
    tier: 'A',
    ascensionStat: ib['Ascension Stat'] ?? '',
    affiliation: ib['Affiliation'] ?? ib['Faction'] ?? '',
    voiceActors: { en: ib['EN VA'] ?? '', jp: ib['JP VA'] ?? '', cn: ib['CN VA'] ?? '' },
  }
}

function extractWeaponFM(raw: RawPage) {
  const ib = raw.infobox
  return {
    slug: raw.title.toLowerCase().replace(/[\/\s]+/g, '-'),
    name: raw.title,
    type: ib['Type'] ?? ib['Weapon Type'] ?? 'Unknown',
    rarity: parseInt(ib['Rarity']?.replace(/[^0-9]/g, '') ?? '4') || 4,
    image: '',
    baseAtk: parseInt(ib['Base ATK']?.replace(/[^0-9]/g, '') ?? '0'),
    subStat: ib['Substat'] ?? ib['Secondary Stat'] ?? '',
    subStatValue: ib['Substat Value'] ?? '',
    effect: ib['Effect'] ?? ib['Skill'] ?? '',
  }
}

function extractEchoFM(raw: RawPage) {
  const ib = raw.infobox
  return {
    slug: raw.title.replace('/Echo', '').toLowerCase().replace(/[\/\s]+/g, '-'),
    name: raw.title.replace('/Echo', ''),
    cost: (parseInt(ib['Cost']?.replace(/[^0-9]/g, '') ?? '1') || 1) as 1 | 3 | 4,
    element: ib['Element'] ?? ib['Attribute'] ?? 'Unknown',
    class: (ib['Class'] ?? 'Common') as 'Common' | 'Elite' | 'Overlord' | 'Calamity',
    image: '',
    skill: ib['Skill'] ?? ib['Echo Skill'] ?? '',
    sonataEffects: (ib['Sonata Effects'] ?? '').split(',').map((s: string) => s.trim()).filter(Boolean),
  }
}

function extractQuestFM(raw: RawPage) {
  const ib = raw.infobox
  return {
    slug: raw.title.toLowerCase().replace(/[\/\s]+/g, '-'),
    name: raw.title,
    type: (ib['Type'] ?? 'Side') as 'Main' | 'Companion' | 'Side' | 'Exploration' | 'Daily',
    chapter: ib['Chapter'] ?? '',
    requirements: ib['Requirements'] ?? '',
    rewards: ib['Rewards'] ?? '',
  }
}

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[2-6]>/gi, '\n\n')
    .replace(/<li>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function writeMDX(category: string, slug: string, fm: Record<string, unknown>, body: string) {
  const dir = path.join(CONTENT, category)
  fs.mkdirSync(dir, { recursive: true })

  const yaml = Object.entries(fm)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n')

  const mdx = `---\n${yaml}\n---\n\n${body}\n`
  fs.writeFileSync(path.join(dir, `${slug}.mdx`), mdx)
}

function generateIndex(category: string) {
  const dir = path.join(CONTENT, category)
  if (!fs.existsSync(dir)) return

  const items = fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf-8')
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (!fmMatch) return null
      const fm: Record<string, unknown> = {}
      for (const line of fmMatch[1].split('\n')) {
        const m = line.match(/^(\w+):\s*(.*)$/)
        if (m) {
          try { fm[m[1]] = JSON.parse(m[2]) }
          catch { fm[m[1]] = m[2].replace(/^["']|["']$/g, '') }
        }
      }
      return {
        slug: fm.slug ?? f.replace('.mdx', ''),
        name: fm.name ?? f.replace('.mdx', ''),
        element: fm.element as string | undefined,
        rarity: fm.rarity as number | undefined,
        weaponType: fm.weaponType as string | undefined,
        image: fm.image as string | undefined,
      }
    })
    .filter(Boolean)

  fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(items, null, 2))
  console.log(`  ${category}/index.json: ${items.length} items`)
}

async function main() {
  const categories = ['characters', 'weapons', 'echoes', 'quests'] as const
  const extractors = {
    characters: extractCharacterFM,
    weapons: extractWeaponFM,
    echoes: extractEchoFM,
    quests: extractQuestFM,
  }

  for (const cat of categories) {
    const dir = path.join(RAW, cat)
    if (!fs.existsSync(dir)) { console.log(`No raw data for ${cat}, skipping`); continue }

    console.log(`Transforming ${cat}...`)
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))

    for (const file of files) {
      const raw: RawPage = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
      const fm = extractors[cat](raw)
      const body = htmlToMarkdown(raw.html)
      writeMDX(cat, fm.slug as string, fm as Record<string, unknown>, body)
    }

    generateIndex(cat)
  }

  console.log('Transformation complete')
}

main().catch(console.error)
