import fs from 'fs'
import path from 'path'
import type { ContentIndex } from './types'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export function loadIndex(category: 'characters' | 'weapons' | 'echoes' | 'quests'): ContentIndex {
  const indexPath = path.join(CONTENT_ROOT, category, 'index.json')
  if (!fs.existsSync(indexPath)) return []
  const raw = fs.readFileSync(indexPath, 'utf-8')
  return JSON.parse(raw) as ContentIndex
}

export function loadMdxSlugs(category: string): string[] {
  const dir = path.join(CONTENT_ROOT, category)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}

export { searchIndex, filterIndex } from './content-utils'
