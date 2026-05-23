'use client'

import { useState, useMemo } from 'react'
import type { ContentIndex } from '@/lib/types'
import { WEAPON_TYPES } from '@/lib/constants'
import { searchIndex, filterIndex } from '@/lib/content-utils'
import SearchBar from '@/components/ui/SearchBar'
import Link from 'next/link'

export default function WeaponsClient({ index }: { index: ContentIndex }) {
  const [query, setQuery] = useState('')
  const [weaponFilter, setWeaponFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState<number | ''>('')

  const filtered = useMemo(() => {
    const result = filterIndex(index, {
      weaponType: weaponFilter || undefined,
      rarity: rarityFilter || undefined,
    })
    return searchIndex(result, query)
  }, [index, query, weaponFilter, rarityFilter])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search weapons..." />
        <select value={weaponFilter} onChange={e => setWeaponFilter(e.target.value)}
          className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white">
          <option value="">All Types</option>
          {WEAPON_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <select value={rarityFilter} onChange={e => setRarityFilter(e.target.value ? Number(e.target.value) : '')}
          className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white">
          <option value="">All Rarities</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★</option>
          <option value="3">★★★</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ww-muted">
          <p className="text-lg font-semibold mb-2">No weapons found</p>
          <p className="text-sm">Run the content migration scripts to populate data.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => (
            <Link key={item.slug} href={`/weapons/${item.slug}`}
              className="card-ww overflow-hidden block">
              <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="max-h-20 object-contain" />
                ) : (
                  <span className="text-3xl opacity-20">&#9876;</span>
                )}
              </div>
              <div className="p-3.5">
                <span className={`text-[0.6rem] font-bold tracking-wide text-amber-400`}>
                  {item.rarity ? '★'.repeat(item.rarity) : ''}
                </span>
                <h4 className="text-sm font-semibold text-ww-text mt-0.5">{item.name}</h4>
                <p className="text-[0.7rem] text-ww-muted mt-0.5">{item.weaponType || ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
