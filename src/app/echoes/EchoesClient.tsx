'use client'

import { useState, useMemo } from 'react'
import type { ContentIndex } from '@/lib/types'
import { ELEMENTS } from '@/lib/constants'
import { searchIndex, filterIndex } from '@/lib/content-utils'
import SearchBar from '@/components/ui/SearchBar'
import Link from 'next/link'

export default function EchoesClient({ index }: { index: ContentIndex }) {
  const [query, setQuery] = useState('')
  const [elementFilter, setElementFilter] = useState('')

  const filtered = useMemo(() => {
    const result = filterIndex(index, {
      element: elementFilter || undefined,
    })
    return searchIndex(result, query)
  }, [index, query, elementFilter])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search echoes..." />
        <select value={elementFilter} onChange={e => setElementFilter(e.target.value)}
          className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white">
          <option value="">All Elements</option>
          {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ww-muted">
          <p className="text-lg font-semibold mb-2">No echoes found</p>
          <p className="text-sm">Run the content migration scripts to populate data.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => (
            <Link key={item.slug} href={`/echoes/${item.slug}`}
              className="card-ww overflow-hidden block">
              <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="max-h-20 object-contain" />
                ) : (
                  <span className="text-3xl opacity-20">&#9678;</span>
                )}
              </div>
              <div className="p-3.5">
                <span className={`text-[0.6rem] font-bold tracking-wide text-amber-400`}>
                  {item.rarity ? '★'.repeat(item.rarity) : ''}
                </span>
                <h4 className="text-sm font-semibold text-ww-text mt-0.5">{item.name}</h4>
                <p className="text-[0.7rem] text-ww-muted mt-0.5">{item.element || ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
