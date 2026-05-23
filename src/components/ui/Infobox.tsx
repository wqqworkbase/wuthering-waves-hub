interface Row {
  label: string
  value: string | number | React.ReactNode
}

interface Props {
  title: string
  image?: string
  rows: Row[]
  className?: string
}

export default function Infobox({ title, image, rows, className = '' }: Props) {
  return (
    <aside className={`bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border overflow-hidden ${className}`}>
      <div className="bg-slate-100 px-4 py-2.5">
        <h3 className="text-sm font-bold text-ww-text">{title}</h3>
      </div>
      {image && (
        <div className="p-4 flex justify-center bg-slate-50 border-b border-ww-border">
          <img src={image} alt={title} className="max-h-40 object-contain rounded" />
        </div>
      )}
      <div className="divide-y divide-ww-border">
        {rows.map((row, i) => (
          <div key={i} className="flex px-4 py-2.5 text-sm">
            <span className="w-1/2 text-ww-muted font-medium shrink-0">{row.label}</span>
            <span className="w-1/2 text-ww-text">{row.value}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
