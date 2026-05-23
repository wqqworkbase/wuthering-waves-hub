'use client'

import { useState, useMemo } from 'react'
import type { ContentIndex } from '@/lib/types'
import { ELEMENTS, WEAPON_TYPES } from '@/lib/constants'
import { searchIndex, filterIndex } from '@/lib/content-utils'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import CharacterCard from '@/components/content/CharacterCard'
import SearchBar from '@/components/ui/SearchBar'
import AdSlot from '@/components/ads/AdSlot'

export default function CharactersClient({ index }: { index: ContentIndex }) {
  const [query, setQuery] = useState('')
  const [elementFilter, setElementFilter] = useState('')
  const [weaponFilter, setWeaponFilter] = useState('')

  const filtered = useMemo(() => {
    const result = filterIndex(index, {
      element: elementFilter || undefined,
      weaponType: weaponFilter || undefined,
    })
    return searchIndex(result, query)
  }, [index, query, elementFilter, weaponFilter])

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Characters</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Resonators</h1>

        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <SearchBar value={query} onChange={setQuery} placeholder="Search characters..." />
              <select
                value={elementFilter}
                onChange={e => setElementFilter(e.target.value)}
                className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white"
              >
                <option value="">All Elements</option>
                {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
              </select>
              <select
                value={weaponFilter}
                onChange={e => setWeaponFilter(e.target.value)}
                className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white"
              >
                <option value="">All Weapons</option>
                {WEAPON_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-ww-muted">
                <p className="text-lg font-semibold mb-2">No characters found</p>
                <p className="text-sm">Run the content migration scripts to populate character data from the Fandom Wiki.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(item => (
                  <CharacterCard key={item.slug} char={{
                    slug: item.slug,
                    name: item.name,
                    element: item.element || 'Glacio',
                    weaponType: item.weaponType || 'Sword',
                    rarity: (item.rarity || 5) as 5,
                    role: 'Main DPS',
                    image: item.image || '',
                    splashArt: '',
                    tier: 'A',
                    ascensionStat: '',
                    affiliation: '',
                    voiceActors: { en: '', jp: '', cn: '' },
                  }} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <AdSlot slotId="" size="300x250" />
          </aside>
        </div>
      </div>
    </PageBackground>
  )
}
