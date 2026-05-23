type BadgeVariant = 'element' | 'rarity' | 'role' | 'tier' | 'weapon'

interface Props {
  variant: BadgeVariant
  value: string
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  element: 'text-xs font-semibold px-2.5 py-0.5 rounded-full',
  rarity: 'text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
  role: 'text-[0.65rem] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600',
  tier: 'text-xs font-bold px-2 py-0.5 rounded',
  weapon: 'text-[0.65rem] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600',
}

export default function Badge({ variant, value, className = '' }: Props) {
  return (
    <span className={`${variantStyles[variant]} ${className}`}>
      {value}
    </span>
  )
}
