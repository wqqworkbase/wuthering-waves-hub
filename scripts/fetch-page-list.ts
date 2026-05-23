import fs from 'fs'
import path from 'path'

const API = 'https://wutheringwaves.fandom.com/api.php'
const CONTENT = path.join(__dirname, '..', 'content')

interface PageItem { pageid: number; title: string }

// Known playable Resonator names (English) — we filter out NPCs
const PLAYABLE_RESONATORS = new Set([
  'Aalto', 'Baizhi', 'Calcharo', 'Camellya', 'Cantarella', 'Carlotta',
  'Changli', 'Danjin', 'Encore', 'Jianxin', 'Jinhsi', 'Jiyan',
  'Lingyang', 'Lumi', 'Mortefi', 'Roccia', 'Rover', 'Sanhua',
  'Shorekeeper', 'Taoqi', 'Verina', 'Xiangli Yao', 'Yangyang',
  'Yinlin', 'Yuanwu', 'Zani',
])

async function fetchCategory(category: string, limit = 200): Promise<PageItem[]> {
  const pages: PageItem[] = []
  let cmcontinue: string | undefined

  do {
    const params = new URLSearchParams({
      action: 'query', format: 'json',
      list: 'categorymembers',
      cmtitle: `Category:${category}`,
      cmlimit: String(limit),
    })
    if (cmcontinue) params.set('cmcontinue', cmcontinue)

    const res = await fetch(`${API}?${params}`)
    const data = await res.json()
    pages.push(...(data.query?.categorymembers ?? []))
    cmcontinue = data.continue?.cmcontinue
  } while (cmcontinue)

  return pages
}

async function main() {
  console.log('Fetching Resonators...')
  const allChars = await fetchCategory('Characters')
  const resonatorSlugs = allChars
    .filter(p => PLAYABLE_RESONATORS.has(p.title))
    .map(p => p.title)
  console.log(`  Found ${resonatorSlugs.length} playable Resonators`)

  console.log('Fetching Weapons...')
  const allWeapons = await fetchCategory('Weapons')
  const weaponSlugs = allWeapons
    .filter(p => !p.title.startsWith('Weapon/') && p.title !== 'Weapon')
    .map(p => p.title)
  console.log(`  Found ${weaponSlugs.length} weapons`)

  console.log('Fetching Echoes...')
  const allEchoes = await fetchCategory('Echoes')
  const echoSlugs = allEchoes
    .filter(p => p.title.endsWith('/Echo') || !p.title.includes('/'))
    .map(p => p.title)
  console.log(`  Found ${echoSlugs.length} echoes`)

  console.log('Fetching Quests...')
  const allQuests = await fetchCategory('Quests')
  const questSlugs = allQuests
    .filter(p => p.title !== 'Quest')
    .map(p => p.title)
  console.log(`  Found ${questSlugs.length} quests`)

  fs.mkdirSync(CONTENT, { recursive: true })
  fs.writeFileSync(
    path.join(CONTENT, 'page-lists.json'),
    JSON.stringify({ characters: resonatorSlugs, weapons: weaponSlugs, echoes: echoSlugs, quests: questSlugs }, null, 2)
  )
  console.log('Saved page-lists.json')
}

main().catch(console.error)
