import type { ContentIndex } from './types'

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
