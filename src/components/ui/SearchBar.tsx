'use client'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: Props) {
  return (
    <div className="flex items-center gap-2 bg-white border border-ww-border rounded-full px-4 py-2.5 w-full max-w-md shadow-ww-sm focus-within:border-ww-cyan focus-within:shadow-ww-glow transition-all">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ww-muted shrink-0">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-ww-muted"
      />
      {value && (
        <button onClick={() => onChange('')} className="text-ww-muted hover:text-ww-text shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  )
}
