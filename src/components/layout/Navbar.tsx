'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/characters', label: 'Characters' },
  { href: '/weapons', label: 'Weapons' },
  { href: '/echoes', label: 'Echoes' },
  { href: '/quests', label: 'Quests' },
  { href: '/tier-list', label: 'Tier List' },
  { href: '/game-mechanics', label: 'Guides' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="text-xl font-extrabold text-gradient-cyan tracking-tight">
          WUWA<span className="font-normal opacity-40">.wiki</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                  pathname === link.href
                    ? 'text-ww-cyan bg-ww-cyan/8'
                    : 'text-ww-label hover:text-ww-cyan hover:bg-ww-cyan/5'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2 bg-ww-bg border border-ww-border rounded-full px-4 py-1.5 min-w-[220px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ww-muted shrink-0">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-ww-text w-full placeholder:text-ww-muted"
          />
        </div>

        <button
          className="lg:hidden flex flex-col gap-1 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-ww-text transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ww-text transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ww-text transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-ww-border bg-ww-surface px-6 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-4 py-2 rounded-lg ${
                pathname === link.href ? 'text-ww-cyan bg-ww-cyan/5' : 'text-ww-label'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
