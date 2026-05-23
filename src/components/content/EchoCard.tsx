import type { EchoFrontmatter } from '@/lib/types'
import { ELEMENT_COLORS } from '@/lib/constants'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function EchoCard({ echo }: { echo: EchoFrontmatter }) {
  const elColors = ELEMENT_COLORS[echo.element] ?? { gradient: 'from-slate-100 to-slate-50', bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' }

  return (
    <Card href={`/echoes/${echo.slug}`}>
      <div className={`h-24 bg-gradient-to-br ${elColors.gradient} flex items-center justify-center`}>
        {echo.image ? (
          <img src={echo.image} alt={echo.name} className="max-h-20 object-contain" />
        ) : (
          <span className="text-3xl opacity-20">&#9678;</span>
        )}
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Badge variant="element" value={echo.element} />
          <span className="text-[0.6rem] font-bold bg-slate-100 text-slate-600 px-1.5 rounded">
            Cost {echo.cost}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-ww-text">{echo.name}</h4>
        <p className="text-[0.7rem] text-ww-muted mt-0.5 truncate">{echo.class}</p>
      </div>
    </Card>
  )
}
