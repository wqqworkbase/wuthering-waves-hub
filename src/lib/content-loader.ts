import fs from 'fs'
import path from 'path'
import type { ContentIndex, ContentIndexItem } from './types'

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

export function searchIndex(index: ContentIndex, query: string): ContentIndex {
  if (!query.trim()) return index
  const q = query.toLowerCase()
  return index.filter(item => {
    const searchable = [item.name, item.element, item.weaponType].filter(Boolean).join(' ').toLowerCase()
    return searchable.includes(q)
  })
}

export function filterIndex(
  index: ContentIndex,
  filters: { element?: string; rarity?: number; weaponType?: string }
): ContentIndex {
  return index.filter(item => {
    if (filters.element && item.element !== filters.element) return false
    if (filters.rarity && item.rarity !== filters.rarity) return false
    if (filters.weaponType && item.weaponType !== filters.weaponType) return false
    return true
  })
}
