'use client'

import { useState, useMemo } from 'react'
import type { ContentIndex } from '@/lib/types'
import { searchIndex } from '@/lib/content-utils'
import SearchBar from '@/components/ui/SearchBar'
import Link from 'next/link'

export default function QuestsClient({ index }: { index: ContentIndex }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return searchIndex(index, query)
  }, [index, query])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search quests..." />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ww-muted">
          <p className="text-lg font-semibold mb-2">No quests found</p>
          <p className="text-sm">Run the content migration scripts to populate data.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <Link key={item.slug} href={`/quests/${item.slug}`}
              className="card-ww overflow-hidden block p-3.5 hover:border-ww-cyan transition-colors">
              <div className="flex items-center gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                ) : (
                  <span className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-lg opacity-30">!</span>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-ww-text">{item.name}</h4>
                  <p className="text-[0.7rem] text-ww-muted mt-0.5">{item.rarity ? '★'.repeat(item.rarity) : ''}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
