import type { WeaponFrontmatter } from '@/lib/types'
import { RARITY_COLORS } from '@/lib/constants'
import Card from '@/components/ui/Card'

export default function WeaponCard({ weapon }: { weapon: WeaponFrontmatter }) {
  const rColors = RARITY_COLORS[weapon.rarity]

  return (
    <Card href={`/weapons/${weapon.slug}`}>
      <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
        {weapon.image ? (
          <img src={weapon.image} alt={weapon.name} className="max-h-20 object-contain" />
        ) : (
          <span className="text-3xl opacity-20">&#9876;</span>
        )}
      </div>
      <div className="p-3.5">
        <span className={`text-[0.6rem] font-bold tracking-wide ${rColors.star}`}>
          {'★'.repeat(weapon.rarity)}
        </span>
        <h4 className="text-sm font-semibold text-ww-text mt-0.5">{weapon.name}</h4>
        <p className="text-[0.7rem] text-ww-muted mt-0.5">{weapon.type} &middot; ATK {weapon.baseAtk}</p>
      </div>
    </Card>
  )
}
