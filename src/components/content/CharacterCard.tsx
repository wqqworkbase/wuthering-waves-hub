import type { CharacterFrontmatter } from '@/lib/types'
import { ELEMENT_COLORS, RARITY_COLORS } from '@/lib/constants'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function CharacterCard({ char }: { char: CharacterFrontmatter }) {
  const elColors = ELEMENT_COLORS[char.element]
  const rColors = RARITY_COLORS[char.rarity]

  return (
    <Card href={`/characters/${char.slug}`}>
      <div className={`h-28 bg-gradient-to-br ${elColors.gradient} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-ww-cyan/5" />
        {char.image ? (
          <img src={char.image} alt={char.name} className="relative z-10 max-h-24 object-contain" />
        ) : (
          <span className="text-4xl relative z-10 opacity-30">{char.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Badge variant="element" value={char.element} />
          <span className={`text-[0.6rem] font-bold tracking-wide ${rColors.star}`}>
            {'★'.repeat(char.rarity)}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-ww-text">{char.name}</h4>
        <p className="text-[0.7rem] text-ww-muted mt-0.5">{char.weaponType} &middot; {char.role}</p>
      </div>
    </Card>
  )
}
