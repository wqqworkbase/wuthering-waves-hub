import type { Tier } from '@/lib/types'
import { TIER_COLORS } from '@/lib/constants'

interface TierEntry {
  name: string
  element: string
  weaponType: string
  role: string
  tier: Tier
  image?: string
}

interface Props {
  tiers: Record<Tier, TierEntry[]>
}

export default function TierTable({ tiers }: Props) {
  return (
    <div className="space-y-4">
      {(Object.entries(tiers) as [Tier, TierEntry[]][]).map(([tier, entries]) => (
        <div key={tier} className="bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border overflow-hidden">
          <div className={`flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-ww-border`}>
            <span className={`text-lg font-extrabold w-8 text-center ${TIER_COLORS[tier]}`}>{tier}</span>
            <span className="text-xs text-ww-muted">{entries.length} Resonators</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-px bg-ww-border">
            {entries.map(entry => (
              <div key={entry.name} className="bg-ww-surface p-3 text-center hover:bg-ww-cyan/3 transition-colors">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 mb-2 flex items-center justify-center text-ww-muted text-xs">
                  {entry.image ? (
                    <img src={entry.image} alt={entry.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    entry.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="text-xs font-semibold text-ww-text truncate">{entry.name}</div>
                <div className="text-[0.65rem] text-ww-muted">{entry.element} &middot; {entry.role}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
