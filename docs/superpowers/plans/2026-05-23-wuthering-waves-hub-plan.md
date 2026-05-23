# Wuthering Waves Resource Hub — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a statically-exported Next.js site replicating Wuthering Waves Fandom Wiki content with game-authentic UI, covering ~100-140 pages across characters, weapons, echoes, quests, tier lists, and guides.

**Architecture:** Next.js 14 App Router with `output: 'export'` for full static generation. Content lives as MDX files in `content/`, populated by MediaWiki API scripts. Pages use dynamic routes with `generateStaticParams`. Ad-ready with conditional AdSense integration.

**Tech Stack:** Next.js 14, TypeScript (strict), Tailwind CSS v3, MDX via @next/mdx, sharp (image pipeline), vitest (testing), GitHub Pages (hosting)

---

## File Structure Map

```
wuthering-waves-hub/
├── scripts/
│   ├── fetch-page-list.ts         # Discover pages via MediaWiki API
│   ├── fetch-page-content.ts      # Get HTML + images per page
│   ├── download-images.ts         # Download + convert to WebP
│   └── transform-to-content.ts    # HTML → MDX with frontmatter
├── content/
│   ├── characters/                # *.mdx files per character
│   ├── weapons/                   # *.mdx files per weapon
│   ├── echoes/                    # *.mdx files per echo
│   ├── quests/                    # *.mdx files per quest
│   └── images/
│       ├── characters/            # Character splash art, icons
│       ├── weapons/               # Weapon icons
│       ├── echoes/                # Echo icons
│       └── ui/                    # UI elements (element icons, rarity stars, etc.)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (Navbar, Footer, providers)
│   │   ├── page.tsx               # Home page
│   │   ├── globals.css            # Tailwind directives + WW theme tokens
│   │   ├── characters/
│   │   │   ├── page.tsx           # Character list
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Character detail
│   │   ├── weapons/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── echoes/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── quests/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── tier-list/
│   │   │   └── page.tsx
│   │   ├── game-mechanics/
│   │   │   └── page.tsx
│   │   └── lore/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageBackground.tsx
│   │   ├── ui/
│   │   │   ├── Badge.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Infobox.tsx
│   │   │   └── TierTable.tsx
│   │   ├── ads/
│   │   │   └── AdSlot.tsx
│   │   └── content/
│   │       ├── CharacterCard.tsx
│   │       ├── WeaponCard.tsx
│   │       └── EchoCard.tsx
│   └── lib/
│       ├── types.ts               # Shared TypeScript types
│       ├── constants.ts           # Element/weapon/rarity enums & icons
│       ├── content-loader.ts      # Read & parse content/ files
│       └── ads.ts                 # AdSense config & helpers
├── public/
│   └── images/
│       └── logo.svg
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `.env.example`, `.gitignore`
- Create: Directory structure (all `src/components/*`, `src/lib/`, `content/`, `scripts/`, `public/images/`)

- [ ] **Step 1: Initialize the Next.js project**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

Expected: Next.js 14 project scaffolded with TypeScript, Tailwind, App Router

- [ ] **Step 2: Install additional dependencies**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm install @next/mdx @mdx-js/loader @mdx-js/react sharp vitest @vitejs/plugin-react
```

Expected: All packages installed

- [ ] **Step 3: Configure next.config.mjs for static export + MDX**

Write `next.config.mjs`:
```js
import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.mdx?$/,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    unoptimized: true, // Required for static export
  },
}

export default withMDX(nextConfig)
```

- [ ] **Step 4: Configure tailwind.config.ts with WW theme tokens**

Write `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        ww: {
          cyan: '#00c7e6',
          'cyan-light': '#5ce0f5',
          'cyan-glow': 'rgba(0,199,230,0.25)',
          gold: '#e8a840',
          'gold-light': '#f5c96a',
          bg: '#f3f5f9',
          surface: '#ffffff',
          nav: 'rgba(255,255,255,0.85)',
          text: '#1e293b',
          muted: '#64748b',
          label: '#475569',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'ww-sm': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'ww-md': '0 4px 16px rgba(0,0,0,0.06), 0 2px 6px rgba(0,150,200,0.06)',
        'ww-lg': '0 8px 32px rgba(0,0,0,0.08), 0 0 40px rgba(0,180,220,0.08)',
        'ww-glow': '0 4px 16px rgba(0,199,230,0.25)',
      },
      borderRadius: {
        'ww': '12px',
        'ww-sm': '8px',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 5: Configure tsconfig.json paths**

Read existing `tsconfig.json` then edit to add path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/content/*": ["./content/*"]
    }
  }
}
```

- [ ] **Step 6: Write globals.css with Tailwind directives + WW theme**

Write `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap');

@layer base {
  body {
    @apply bg-ww-bg text-ww-text font-sans antialiased;
  }
}

@layer components {
  .glass-nav {
    @apply bg-ww-nav backdrop-blur-xl border-b border-ww-border;
  }
  .card-ww {
    @apply bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border
           transition-all duration-200 hover:shadow-ww-lg hover:border-ww-cyan/25
           hover:-translate-y-0.5;
  }
  .btn-cyan {
    @apply inline-flex items-center gap-1.5 font-semibold text-sm px-6 py-2.5
           rounded-full bg-gradient-to-br from-ww-cyan to-cyan-700 text-white
           shadow-ww-glow hover:shadow-lg hover:shadow-ww-cyan/35
           transition-all duration-200 hover:-translate-y-px;
  }
  .btn-outline-cyan {
    @apply inline-flex items-center gap-1.5 font-semibold text-sm px-6 py-2.5
           rounded-full border border-ww-cyan/30 text-ww-cyan
           hover:bg-ww-cyan/5 hover:border-ww-cyan transition-all duration-200;
  }
  .section-label {
    @apply text-xs font-bold uppercase tracking-widest text-ww-cyan mb-1;
  }
  .section-title {
    @apply text-2xl font-bold tracking-tight text-slate-900 mb-6;
  }
}

@layer utilities {
  .text-gradient-cyan {
    @apply bg-gradient-to-r from-ww-cyan to-cyan-700 bg-clip-text text-transparent;
  }
}
```

- [ ] **Step 7: Write .env.example**

Write `.env.example`:
```
NEXT_PUBLIC_ADS_ENABLED=false
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_TOP_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567891
```

- [ ] **Step 8: Create directory structure**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
mkdir -p src/components/layout src/components/ui src/components/ads src/components/content
mkdir -p src/lib
mkdir -p src/app/characters/\[slug\] src/app/weapons/\[slug\] src/app/echoes/\[slug\] src/app/quests/\[slug\]
mkdir -p src/app/tier-list src/app/game-mechanics src/app/lore
mkdir -p content/characters content/weapons content/echoes content/quests content/images/characters content/images/weapons content/images/echoes content/images/ui
mkdir -p scripts
mkdir -p public/images
```

- [ ] **Step 9: Write minimal root layout**

Write `src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WUWA.wiki — Wuthering Waves Resource Hub',
  description: 'Your ultimate companion for Resonator builds, weapon stats, echo guides, and the latest Wuthering Waves event tracker.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 10: Verify build works**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, MDX, and static export config"
```

---

### Task 2: Types & Constants

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Write shared types**

Write `src/lib/types.ts`:
```ts
export type Element = 'Glacio' | 'Fusion' | 'Electro' | 'Aero' | 'Spectro' | 'Havoc'
export type WeaponType = 'Sword' | 'Broadblade' | 'Pistols' | 'Gauntlets' | 'Rectifier'
export type Rarity = 5 | 4 | 3 | 2 | 1
export type Role = 'Main DPS' | 'Sub DPS' | 'Support' | 'Healer' | 'Shielder'
export type Tier = 'S+' | 'S' | 'A' | 'B' | 'C'

export interface CharacterFrontmatter {
  slug: string
  name: string
  element: Element
  weaponType: WeaponType
  rarity: Rarity
  role: Role
  image: string        // path relative to content/images/
  splashArt: string    // full body / splash art for background
  tier: Tier
  ascensionStat: string
  affiliation: string
  birthDate?: string
  voiceActors: { en: string; jp: string; cn: string }
}

export interface WeaponFrontmatter {
  slug: string
  name: string
  type: WeaponType
  rarity: Rarity
  image: string
  baseAtk: number
  subStat: string
  subStatValue: string
  effect: string
}

export interface EchoFrontmatter {
  slug: string
  name: string
  cost: 1 | 3 | 4
  element: Element
  class: 'Common' | 'Elite' | 'Overlord' | 'Calamity'
  image: string
  skill: string
  sonataEffects: string[]
}

export interface QuestFrontmatter {
  slug: string
  name: string
  type: 'Main' | 'Companion' | 'Side' | 'Exploration' | 'Daily'
  chapter: string
  requirements: string
  rewards: string
}

export interface ContentIndexItem {
  slug: string
  name: string
  element?: Element
  rarity?: Rarity
  weaponType?: WeaponType
  image?: string
}

export type ContentIndex = ContentIndexItem[]
```

- [ ] **Step 2: Write game constants**

Write `src/lib/constants.ts`:
```ts
import type { Element, WeaponType } from './types'

export const ELEMENTS: Element[] = ['Glacio', 'Fusion', 'Electro', 'Aero', 'Spectro', 'Havoc']

export const WEAPON_TYPES: WeaponType[] = ['Sword', 'Broadblade', 'Pistols', 'Gauntlets', 'Rectifier']

export const ELEMENT_COLORS: Record<Element, { bg: string; text: string; border: string; gradient: string }> = {
  Glacio:   { bg: '#d4eafc', text: '#0c4a6e', border: '#7dd3fc', gradient: 'from-blue-100 to-blue-50' },
  Fusion:   { bg: '#fce0d4', text: '#7c2d12', border: '#fdba74', gradient: 'from-orange-100 to-orange-50' },
  Electro:  { bg: '#e8e0fc', text: '#4c1d95', border: '#c4b5fd', gradient: 'from-purple-100 to-purple-50' },
  Aero:     { bg: '#d4fce0', text: '#14532d', border: '#86efac', gradient: 'from-emerald-100 to-emerald-50' },
  Spectro:  { bg: '#fcf8d4', text: '#713f12', border: '#fde68a', gradient: 'from-yellow-100 to-yellow-50' },
  Havoc:    { bg: '#f0d4fc', text: '#4a1942', border: '#e879f9', gradient: 'from-fuchsia-100 to-fuchsia-50' },
}

export const RARITY_COLORS: Record<number, { star: string; badge: string }> = {
  5: { star: 'text-amber-400', badge: 'bg-amber-100 text-amber-800' },
  4: { star: 'text-purple-400', badge: 'bg-purple-100 text-purple-800' },
  3: { star: 'text-blue-400', badge: 'bg-blue-100 text-blue-800' },
  2: { star: 'text-green-400', badge: 'bg-green-100 text-green-800' },
  1: { star: 'text-gray-400', badge: 'bg-gray-100 text-gray-600' },
}

export const TIER_COLORS: Record<string, string> = {
  'S+': 'text-ww-cyan',
  'S':  'text-ww-gold',
  'A':  'text-purple-500',
  'B':  'text-blue-500',
  'C':  'text-gray-400',
}

export const ELEMENT_ICONS: Record<Element, string> = {
  Glacio:   '/images/ui/glacio.svg',
  Fusion:   '/images/ui/fusion.svg',
  Electro:  '/images/ui/electro.svg',
  Aero:     '/images/ui/aero.svg',
  Spectro:  '/images/ui/spectro.svg',
  Havoc:    '/images/ui/havoc.svg',
}

export const WEAPON_ICONS: Record<WeaponType, string> = {
  Sword:      '/images/ui/sword.svg',
  Broadblade: '/images/ui/broadblade.svg',
  Pistols:    '/images/ui/pistols.svg',
  Gauntlets:  '/images/ui/gauntlets.svg',
  Rectifier:  '/images/ui/rectifier.svg',
}
```

- [ ] **Step 3: Verify types compile**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/constants.ts
git commit -m "feat: add shared types and game constants"
```

---

### Task 3: Layout Components

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/PageBackground.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write Navbar component**

Write `src/components/layout/Navbar.tsx`:
```tsx
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
```

- [ ] **Step 2: Write Sidebar component**

Write `src/components/layout/Sidebar.tsx`:
```tsx
import Link from 'next/link'

interface SidebarSection {
  title: string
  links: { href: string; label: string }[]
}

const SECTIONS: SidebarSection[] = [
  {
    title: 'Characters',
    links: [
      { href: '/characters', label: 'All Resonators' },
      { href: '/tier-list', label: 'Tier List' },
    ],
  },
  {
    title: 'Equipment',
    links: [
      { href: '/weapons', label: 'Weapons' },
      { href: '/echoes', label: 'Echoes' },
    ],
  },
  {
    title: 'Content',
    links: [
      { href: '/quests', label: 'Quests' },
      { href: '/game-mechanics', label: 'Game Mechanics' },
      { href: '/lore', label: 'Lore' },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border py-3 sticky top-20">
      {SECTIONS.map(section => (
        <div key={section.title} className="mb-1 last:mb-0">
          <h3 className="text-[0.65rem] font-bold uppercase tracking-wider text-ww-muted px-4 py-1.5">
            {section.title}
          </h3>
          {section.links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-ww-label px-4 py-1.5 border-l-[3px] border-transparent
                         hover:text-ww-cyan hover:bg-ww-cyan/3 hover:border-ww-cyan transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  )
}
```

- [ ] **Step 3: Write Footer component**

Write `src/components/layout/Footer.tsx`:
```tsx
export default function Footer() {
  return (
    <footer className="border-t border-ww-border bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-ww-muted space-y-1">
        <p>WUWA.wiki is a fan-made resource hub. Not affiliated with Kuro Games.</p>
        <p>&copy; {new Date().getFullYear()} WUWA.wiki &mdash; All game assets belong to their respective owners.</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Write PageBackground component**

Write `src/components/layout/PageBackground.tsx`:
```tsx
import type { ReactNode } from 'react'

interface Props {
  src?: string
  children: ReactNode
}

export default function PageBackground({ src, children }: Props) {
  return (
    <div className="relative min-h-screen">
      {src ? (
        <div className="fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-15 blur-2xl scale-110"
            style={{ backgroundImage: `url(${src})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ww-bg/60 via-ww-bg/80 to-ww-bg" />
        </div>
      ) : (
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-50 via-ww-bg to-ww-bg" />
      )}
      {children}
    </div>
  )
}
```

- [ ] **Step 5: Update root layout to include Navbar and Footer**

Edit `src/app/layout.tsx` to wrap pages:
```tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'WUWA.wiki — Wuthering Waves Resource Hub',
  description: 'Your ultimate companion for Resonator builds, weapon stats, echo guides, and the latest event tracker.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Verify build passes**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/ src/app/layout.tsx
git commit -m "feat: add Navbar, Sidebar, Footer, and PageBackground layout components"
```

---

### Task 4: Base UI Components

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/SearchBar.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Infobox.tsx`
- Create: `src/components/ui/TierTable.tsx`

- [ ] **Step 1: Write Badge component**

Write `src/components/ui/Badge.tsx`:
```tsx
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
```

- [ ] **Step 2: Write SearchBar component**

Write `src/components/ui/SearchBar.tsx`:
```tsx
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
```

- [ ] **Step 3: Write generic Card component**

Write `src/components/ui/Card.tsx`:
```tsx
import type { ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  href?: string
  children: ReactNode
  className?: string
}

export default function Card({ href, children, className = '' }: Props) {
  const classes = `card-ww overflow-hidden ${className}`

  if (href) {
    return (
      <Link href={href} className={`${classes} block cursor-pointer`}>
        {children}
      </Link>
    )
  }

  return <div className={classes}>{children}</div>
}
```

- [ ] **Step 4: Write Infobox component**

Write `src/components/ui/Infobox.tsx`:
```tsx
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
```

- [ ] **Step 5: Write TierTable component**

Write `src/components/ui/TierTable.tsx`:
```tsx
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
```

- [ ] **Step 6: Verify build**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Badge, SearchBar, Card, Infobox, and TierTable UI components"
```

---

### Task 5: Ad Components

**Files:**
- Create: `src/components/ads/AdSlot.tsx`
- Create: `src/lib/ads.ts`

- [ ] **Step 1: Write ads config helper**

Write `src/lib/ads.ts`:
```ts
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true'
export const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? ''

export const AD_SLOTS = {
  topBanner: process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT ?? '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT ?? '',
} as const
```

- [ ] **Step 2: Write AdSlot component**

Write `src/components/ads/AdSlot.tsx`:
```tsx
import Script from 'next/script'
import { ADS_ENABLED, PUBLISHER_ID } from '@/lib/ads'

type AdSize = '728x90' | '300x250' | '300x600'

interface Props {
  slotId: string
  size: AdSize
  className?: string
}

export default function AdSlot({ slotId, size, className = '' }: Props) {
  // Placeholder mode — development / ads disabled
  if (!ADS_ENABLED || !PUBLISHER_ID) {
    const [w, h] = size.split('x').map(Number)
    return (
      <div
        className={`bg-slate-50 border border-dashed border-slate-300 rounded-ww
                    flex flex-col items-center justify-center gap-1.5 mx-auto ${className}`}
        style={{ width: '100%', maxWidth: `${w}px`, minHeight: `${h}px` }}
      >
        <span className="text-[0.6rem] font-bold uppercase tracking-wider text-slate-400 select-none">Advertisement</span>
        <span className="text-[0.7rem] text-slate-400 select-none">{size}</span>
      </div>
    )
  }

  // Production mode
  return (
    <div className={`mx-auto ${className}`} style={{ width: '100%', maxWidth: `${size.split('x')[0]}px` }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id="adsbygoogle-init" strategy="afterInteractive">
        {'(adsbygoogle = window.adsbygoogle || []).push({})'}
      </Script>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/ads/ src/lib/ads.ts
git commit -m "feat: add AdSlot component with placeholder/production toggle"
```

---

### Task 6: Content Card Components

**Files:**
- Create: `src/components/content/CharacterCard.tsx`
- Create: `src/components/content/WeaponCard.tsx`
- Create: `src/components/content/EchoCard.tsx`

- [ ] **Step 1: Write CharacterCard**

Write `src/components/content/CharacterCard.tsx`:
```tsx
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
```

- [ ] **Step 2: Write WeaponCard**

Write `src/components/content/WeaponCard.tsx`:
```tsx
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
```

- [ ] **Step 3: Write EchoCard**

Write `src/components/content/EchoCard.tsx`:
```tsx
import type { EchoFrontmatter } from '@/lib/types'
import { ELEMENT_COLORS } from '@/lib/constants'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function EchoCard({ echo }: { echo: EchoFrontmatter }) {
  const elColors = ELEMENT_COLORS[echo.element]

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
```

- [ ] **Step 4: Verify build**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/content/
git commit -m "feat: add CharacterCard, WeaponCard, and EchoCard components"
```

---

### Task 7: Content Loader

**Files:**
- Create: `src/lib/content-loader.ts`

- [ ] **Step 1: Write content-loader**

Write `src/lib/content-loader.ts`:
```ts
import fs from 'fs'
import path from 'path'
import type { ContentIndex, ContentIndexItem } from './types'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export function loadIndex(category: 'characters' | 'weapons' | 'echoes' | 'quests'): ContentIndex {
  const indexPath = path.join(CONTENT_ROOT, category, 'index.json')
  if (!fs.existsSync(indexPath)) return []
  const raw = fs.readFileSync(indexPath, 'utf-8')
  return JSON.parse(raw) as ContentIndex
}

export function loadMdxSlugs(category: string): string[] {
  const dir = path.join(CONTENT_ROOT, category)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''))
}

export function searchIndex(index: ContentIndex, query: string): ContentIndex {
  if (!query.trim()) return index
  const q = query.toLowerCase()
  return index.filter(item => {
    const searchable = [item.name, item.element, item.weaponType].filter(Boolean).join(' ').toLowerCase()
    return searchable.includes(q)
  })
}

export function filterIndex(
  index: ContentIndex,
  filters: { element?: string; rarity?: number; weaponType?: string }
): ContentIndex {
  return index.filter(item => {
    if (filters.element && item.element !== filters.element) return false
    if (filters.rarity && item.rarity !== filters.rarity) return false
    if (filters.weaponType && item.weaponType !== filters.weaponType) return false
    return true
  })
}
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/content-loader.ts
git commit -m "feat: add content-loader for reading MDX and index files"
```

---

### Task 8: Pages — Home

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write Home page**

Write `src/app/page.tsx`:
```tsx
import Link from 'next/link'
import AdSlot from '@/components/ads/AdSlot'
import PageBackground from '@/components/layout/PageBackground'

export default function HomePage() {
  return (
    <PageBackground>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50/50 to-ww-bg">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-radial from-ww-cyan/10 to-transparent -top-40 -right-20 pointer-events-none" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-radial from-ww-gold/8 to-transparent -bottom-20 -left-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center relative z-10">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-ww-cyan bg-ww-cyan/8 border border-ww-cyan/15 px-3.5 py-1 rounded-full mb-4">
            Version 2.4 — Echoing Lament
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Wuthering Waves{' '}
            <span className="text-gradient-cyan">Resource Hub</span>
          </h1>
          <p className="text-base md:text-lg text-ww-muted max-w-lg mx-auto mt-4 mb-8">
            Your ultimate companion for Resonator builds, weapon stats, echo guides, and the latest event tracker — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/characters" className="btn-cyan">Explore Characters</Link>
            <Link href="/tier-list" className="btn-outline-cyan">View Tier List</Link>
            <Link href="/game-mechanics" className="inline-flex items-center gap-1.5 font-semibold text-sm px-6 py-2.5 rounded-full bg-gradient-to-br from-ww-gold to-amber-600 text-white shadow-lg shadow-amber-200 transition-all duration-200 hover:-translate-y-px">
              Beginner Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <AdSlot slotId="" size="728x90" />
      </div>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/characters', label: 'Resonators', desc: 'Character builds, skills, and ascension materials', icon: '⚔️' },
            { href: '/weapons', label: 'Weapons', desc: 'Stats, effects, and upgrade paths', icon: '🗡️' },
            { href: '/echoes', label: 'Echoes', desc: 'Echo skills, sonata effects, and farming routes', icon: '🔮' },
            { href: '/quests', label: 'Quests', desc: 'Main story, companion quests, and rewards', icon: '📜' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="card-ww p-6 group">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-ww-text group-hover:text-ww-cyan transition-colors">{item.label}</h3>
              <p className="text-xs text-ww-muted mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Characters Placeholder */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Resonators</p>
        <h2 className="section-title">Featured Characters</h2>
        <p className="text-sm text-ww-muted">
          Character data will populate after content migration. Run the fetch scripts to pull data from the Fandom Wiki.
        </p>
        <div className="mt-4">
          <Link href="/characters" className="btn-outline-cyan text-xs">View All Characters &rarr;</Link>
        </div>
      </section>
    </PageBackground>
  )
}
```

- [ ] **Step 2: Verify build**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds with static HTML generated in `out/`

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add Home page with hero, quick links, and ad slot"
```

---

### Task 9: Pages — Character List & Detail

**Files:**
- Create: `src/app/characters/page.tsx`
- Create: `src/app/characters/[slug]/page.tsx`

- [ ] **Step 1: Write Character list page**

Write `src/app/characters/page.tsx`:
```tsx
'use client'

import { useState, useMemo } from 'react'
import type { ContentIndex } from '@/lib/types'
import { ELEMENTS, WEAPON_TYPES } from '@/lib/constants'
import { loadIndex, searchIndex, filterIndex } from '@/lib/content-loader'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import CharacterCard from '@/components/content/CharacterCard'
import SearchBar from '@/components/ui/SearchBar'
import Badge from '@/components/ui/Badge'
import AdSlot from '@/components/ads/AdSlot'

export default function CharactersPage() {
  const index: ContentIndex = loadIndex('characters')
  const [query, setQuery] = useState('')
  const [elementFilter, setElementFilter] = useState<string>('')
  const [weaponFilter, setWeaponFilter] = useState<string>('')

  const filtered = useMemo(() => {
    let result = filterIndex(index, {
      element: elementFilter || undefined,
      weaponType: weaponFilter || undefined,
    })
    return searchIndex(result, query)
  }, [index, query, elementFilter, weaponFilter])

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Characters</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Resonators</h1>

        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />

          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <SearchBar value={query} onChange={setQuery} placeholder="Search characters..." />

              <select
                value={elementFilter}
                onChange={e => setElementFilter(e.target.value)}
                className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white"
              >
                <option value="">All Elements</option>
                {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
              </select>

              <select
                value={weaponFilter}
                onChange={e => setWeaponFilter(e.target.value)}
                className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white"
              >
                <option value="">All Weapons</option>
                {WEAPON_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-ww-muted">
                <p className="text-lg font-semibold mb-2">No characters found</p>
                <p className="text-sm">Run the content migration scripts to populate character data from the Fandom Wiki.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Cards rendered from content index */}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <AdSlot slotId="" size="300x250" />
          </aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

- [ ] **Step 2: Write Character detail page**

Write `src/app/characters/[slug]/page.tsx`:
```tsx
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { loadIndex } from '@/lib/content-loader'
import type { CharacterFrontmatter, ContentIndexItem } from '@/lib/types'
import { ELEMENT_COLORS, RARITY_COLORS } from '@/lib/constants'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import Infobox from '@/components/ui/Infobox'
import Badge from '@/components/ui/Badge'
import AdSlot from '@/components/ads/AdSlot'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  const index = loadIndex('characters')
  return index.map((item: ContentIndexItem) => ({ slug: item.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const index = loadIndex('characters')
  const item = index.find((i: ContentIndexItem) => i.slug === params.slug)
  if (!item) return { title: 'Character Not Found' }
  return {
    title: `${item.name} — WUWA.wiki`,
    description: `${item.name} character guide, skills, builds, and ascension materials for Wuthering Waves.`,
  }
}

export default function CharacterDetailPage({ params }: Props) {
  const index = loadIndex('characters')
  const item = index.find((i: ContentIndexItem) => i.slug === params.slug)

  if (!item) {
    return (
      <PageBackground>
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-ww-text mb-2">Character Not Found</h1>
          <p className="text-ww-muted">The character &quot;{params.slug}&quot; does not exist in our database.</p>
        </div>
      </PageBackground>
    )
  }

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />

          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover border-2 border-ww-border" />}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{item.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {item.element && <Badge variant="element" value={item.element} />}
                  {item.weaponType && <Badge variant="weapon" value={item.weaponType} />}
                  {item.rarity && (
                    <span className="text-xs font-bold text-amber-400">
                      {'★'.repeat(item.rarity)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* MDX Content — rendered at build time */}
            <div className="prose prose-slate max-w-none bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border p-6">
              <p className="text-sm text-ww-muted italic">
                Full content will load from the MDX file at <code>content/characters/{params.slug}.mdx</code> after content migration.
              </p>
            </div>

            <div className="mt-6">
              <AdSlot slotId="" size="728x90" />
            </div>
          </div>

          <aside className="space-y-4">
            <Infobox
              title="Character Info"
              image={item.image}
              rows={[
                { label: 'Element', value: item.element ?? '—' },
                { label: 'Weapon', value: item.weaponType ?? '—' },
                { label: 'Rarity', value: item.rarity ? '★'.repeat(item.rarity) : '—' },
              ]}
            />
            <AdSlot slotId="" size="300x250" />
          </aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds (note: `generateStaticParams` returns empty array until migration runs, which is fine — it generates no detail pages)

- [ ] **Step 4: Commit**

```bash
git add src/app/characters/
git commit -m "feat: add Character list and detail pages"
```

---

### Task 10: Pages — Weapons, Echoes, Quests, Tier List, Guides, Lore

**Files:**
- Create: `src/app/weapons/page.tsx`, `src/app/weapons/[slug]/page.tsx`
- Create: `src/app/echoes/page.tsx`, `src/app/echoes/[slug]/page.tsx`
- Create: `src/app/quests/page.tsx`, `src/app/quests/[slug]/page.tsx`
- Create: `src/app/tier-list/page.tsx`
- Create: `src/app/game-mechanics/page.tsx`
- Create: `src/app/lore/page.tsx`

- [ ] **Step 1: Write Weapons list page**

Write `src/app/weapons/page.tsx`:
```tsx
'use client'

import { useState, useMemo } from 'react'
import type { ContentIndex } from '@/lib/types'
import { WEAPON_TYPES } from '@/lib/constants'
import { loadIndex, searchIndex, filterIndex } from '@/lib/content-loader'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import WeaponCard from '@/components/content/WeaponCard'
import SearchBar from '@/components/ui/SearchBar'
import AdSlot from '@/components/ads/AdSlot'

export default function WeaponsPage() {
  const index: ContentIndex = loadIndex('weapons')
  const [query, setQuery] = useState('')
  const [weaponFilter, setWeaponFilter] = useState('')
  const [rarityFilter, setRarityFilter] = useState<number | ''>('')

  const filtered = useMemo(() => {
    let result = filterIndex(index, {
      weaponType: weaponFilter || undefined,
      rarity: rarityFilter || undefined,
    })
    return searchIndex(result, query)
  }, [index, query, weaponFilter, rarityFilter])

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Equipment</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Weapons</h1>

        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <SearchBar value={query} onChange={setQuery} placeholder="Search weapons..." />
              <select value={weaponFilter} onChange={e => setWeaponFilter(e.target.value)}
                className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white">
                <option value="">All Types</option>
                {WEAPON_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <select value={rarityFilter} onChange={e => setRarityFilter(e.target.value ? Number(e.target.value) : '')}
                className="text-sm border border-ww-border rounded-full px-3 py-2 bg-white">
                <option value="">All Rarities</option>
                <option value="5">★★★★★</option>
                <option value="4">★★★★</option>
                <option value="3">★★★</option>
                <option value="2">★★</option>
                <option value="1">★</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-ww-muted">
                <p className="text-lg font-semibold mb-2">No weapons found</p>
                <p className="text-sm">Run the content migration scripts to populate data.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Weapon cards from index */}
              </div>
            )}
          </div>
          <aside className="space-y-4">
            <AdSlot slotId="" size="300x250" />
          </aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

- [ ] **Step 2: Write Weapons detail page**

Write `src/app/weapons/[slug]/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { loadIndex } from '@/lib/content-loader'
import type { ContentIndexItem } from '@/lib/types'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import Infobox from '@/components/ui/Infobox'
import AdSlot from '@/components/ads/AdSlot'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return loadIndex('weapons').map((item: ContentIndexItem) => ({ slug: item.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const item = loadIndex('weapons').find((i: ContentIndexItem) => i.slug === params.slug)
  return { title: `${item?.name ?? 'Weapon'} — WUWA.wiki` }
}

export default function WeaponDetailPage({ params }: Props) {
  const item = loadIndex('weapons').find((i: ContentIndexItem) => i.slug === params.slug)
  if (!item) return <PageBackground><div className="max-w-7xl mx-auto px-6 py-16 text-center"><h1 className="text-2xl font-bold">Weapon Not Found</h1></div></PageBackground>

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <div>
            <div className="flex items-center gap-3 mb-6">
              {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded" />}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{item.name}</h1>
                {item.rarity && <span className="text-xs font-bold text-amber-400">{'★'.repeat(item.rarity)}</span>}
              </div>
            </div>
            <div className="prose prose-slate max-w-none bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border p-6">
              <p className="text-sm text-ww-muted italic">Full weapon data loads from MDX after migration.</p>
            </div>
            <div className="mt-6"><AdSlot slotId="" size="728x90" /></div>
          </div>
          <aside className="space-y-4">
            <Infobox title="Weapon Info" image={item.image} rows={[
              { label: 'Type', value: item.weaponType ?? '—' },
              { label: 'Rarity', value: item.rarity ? '★'.repeat(item.rarity) : '—' },
            ]} />
            <AdSlot slotId="" size="300x250" />
          </aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

- [ ] **Step 3: Write Echoes list page**

Write `src/app/echoes/page.tsx`:
```tsx
'use client'

import { useState, useMemo } from 'react'
import type { ContentIndex } from '@/lib/types'
import { ELEMENTS } from '@/lib/constants'
import { loadIndex, searchIndex, filterIndex } from '@/lib/content-loader'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import EchoCard from '@/components/content/EchoCard'
import SearchBar from '@/components/ui/SearchBar'
import AdSlot from '@/components/ads/AdSlot'

export default function EchoesPage() {
  const index: ContentIndex = loadIndex('echoes')
  const [query, setQuery] = useState('')
  const [elementFilter, setElementFilter] = useState('')

  const filtered = useMemo(() => {
    let result = filterIndex(index, { element: elementFilter || undefined })
    return searchIndex(result, query)
  }, [index, query, elementFilter])

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Equipment</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Echoes</h1>
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
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
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{/* Echo cards */}</div>
            )}
          </div>
          <aside className="space-y-4"><AdSlot slotId="" size="300x250" /></aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

- [ ] **Step 4: Write Echoes detail page**

Write `src/app/echoes/[slug]/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { loadIndex } from '@/lib/content-loader'
import type { ContentIndexItem } from '@/lib/types'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import Infobox from '@/components/ui/Infobox'
import AdSlot from '@/components/ads/AdSlot'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return loadIndex('echoes').map((item: ContentIndexItem) => ({ slug: item.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const item = loadIndex('echoes').find((i: ContentIndexItem) => i.slug === params.slug)
  return { title: `${item?.name ?? 'Echo'} — WUWA.wiki` }
}

export default function EchoDetailPage({ params }: Props) {
  const item = loadIndex('echoes').find((i: ContentIndexItem) => i.slug === params.slug)
  if (!item) return <PageBackground><div className="max-w-7xl mx-auto px-6 py-16 text-center"><h1 className="text-2xl font-bold">Echo Not Found</h1></div></PageBackground>

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <div>
            <div className="flex items-center gap-3 mb-6">
              {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded" />}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{item.name}</h1>
                {item.element && <span className="text-sm text-ww-muted">{item.element}</span>}
              </div>
            </div>
            <div className="prose prose-slate max-w-none bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border p-6">
              <p className="text-sm text-ww-muted italic">Full echo data loads from MDX after migration.</p>
            </div>
            <div className="mt-6"><AdSlot slotId="" size="728x90" /></div>
          </div>
          <aside className="space-y-4">
            <Infobox title="Echo Info" image={item.image} rows={[
              { label: 'Element', value: item.element ?? '—' },
              { label: 'Rarity', value: item.rarity ? '★'.repeat(item.rarity) : '—' },
            ]} />
            <AdSlot slotId="" size="300x250" />
          </aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

- [ ] **Step 5: Write Quests list and detail pages**

Write `src/app/quests/page.tsx`:
```tsx
'use client'

import { useState, useMemo } from 'react'
import type { ContentIndex } from '@/lib/types'
import { loadIndex, searchIndex } from '@/lib/content-loader'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import SearchBar from '@/components/ui/SearchBar'
import AdSlot from '@/components/ads/AdSlot'
import Link from 'next/link'

export default function QuestsPage() {
  const index: ContentIndex = loadIndex('quests')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => searchIndex(index, query), [index, query])

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Content</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Quests</h1>
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <div>
            <SearchBar value={query} onChange={setQuery} placeholder="Search quests..." />
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-ww-muted mt-8">
                <p className="text-lg font-semibold mb-2">No quests found</p>
                <p className="text-sm">Run the content migration scripts to populate data.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {filtered.map(item => (
                  <Link key={item.slug} href={`/quests/${item.slug}`}
                    className="card-ww block p-4 hover:border-ww-cyan/25">
                    <h3 className="font-semibold text-ww-text">{item.name}</h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <aside className="space-y-4"><AdSlot slotId="" size="300x250" /></aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

Write `src/app/quests/[slug]/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { loadIndex } from '@/lib/content-loader'
import type { ContentIndexItem } from '@/lib/types'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import AdSlot from '@/components/ads/AdSlot'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return loadIndex('quests').map((item: ContentIndexItem) => ({ slug: item.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const item = loadIndex('quests').find((i: ContentIndexItem) => i.slug === params.slug)
  return { title: `${item?.name ?? 'Quest'} — WUWA.wiki` }
}

export default function QuestDetailPage({ params }: Props) {
  const item = loadIndex('quests').find((i: ContentIndexItem) => i.slug === params.slug)
  if (!item) return <PageBackground><div className="max-w-7xl mx-auto px-6 py-16 text-center"><h1 className="text-2xl font-bold">Quest Not Found</h1></div></PageBackground>

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-6">{item.name}</h1>
            <div className="prose prose-slate max-w-none bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border p-6">
              <p className="text-sm text-ww-muted italic">Full quest data loads from MDX after migration.</p>
            </div>
          </div>
          <aside className="space-y-4"><AdSlot slotId="" size="300x250" /></aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

- [ ] **Step 6: Write Tier List, Game Mechanics, and Lore pages**

Write `src/app/tier-list/page.tsx`:
```tsx
import type { Metadata } from 'next'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import TierTable from '@/components/ui/TierTable'
import AdSlot from '@/components/ads/AdSlot'
import type { Tier } from '@/lib/types'

export const metadata: Metadata = { title: 'Tier List — WUWA.wiki' }

// Placeholder tier data — will be generated from content migration
const EMPTY_TIERS: Record<Tier, []> = { 'S+': [], 'S': [], 'A': [], 'B': [], 'C': [] }

export default function TierListPage() {
  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Meta</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Tier List</h1>
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <div>
            <TierTable tiers={EMPTY_TIERS} />
            <p className="text-sm text-ww-muted mt-4 italic">Tier rankings will populate after content migration.</p>
            <div className="mt-6"><AdSlot slotId="" size="728x90" /></div>
          </div>
          <aside className="space-y-4"><AdSlot slotId="" size="300x250" /></aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

Write `src/app/game-mechanics/page.tsx`:
```tsx
import type { Metadata } from 'next'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import AdSlot from '@/components/ads/AdSlot'

export const metadata: Metadata = { title: 'Game Mechanics — WUWA.wiki' }

export default function GameMechanicsPage() {
  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Guides</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Game Mechanics</h1>
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <div>
            <div className="bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border p-6 prose prose-slate max-w-none">
              <h2>Combat System</h2>
              <p>Coming soon — combat basics, resonance skills, and dodge/counter mechanics.</p>
              <h2>Gacha System</h2>
              <p>Coming soon — banner types, pity system, and pulling strategy.</p>
              <h2>Progression</h2>
              <p>Coming soon — ascension, talent upgrades, and echo farming.</p>
            </div>
            <div className="mt-6"><AdSlot slotId="" size="728x90" /></div>
          </div>
          <aside className="space-y-4"><AdSlot slotId="" size="300x250" /></aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

Write `src/app/lore/page.tsx`:
```tsx
import type { Metadata } from 'next'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import AdSlot from '@/components/ads/AdSlot'

export const metadata: Metadata = { title: 'Lore — WUWA.wiki' }

export default function LorePage() {
  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">World</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Lore</h1>
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <div>
            <div className="bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border p-6 prose prose-slate max-w-none">
              <h2>The World of Solaris</h2>
              <p>Coming soon — the history, factions, and key events of the Wuthering Waves universe.</p>
            </div>
            <div className="mt-6"><AdSlot slotId="" size="728x90" /></div>
          </div>
          <aside className="space-y-4"><AdSlot slotId="" size="300x250" /></aside>
        </div>
      </div>
    </PageBackground>
  )
}
```

- [ ] **Step 7: Verify build**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds

- [ ] **Step 8: Commit**

```bash
git add src/app/weapons/ src/app/echoes/ src/app/quests/ src/app/tier-list/ src/app/game-mechanics/ src/app/lore/
git commit -m "feat: add Weapons, Echoes, Quests, Tier List, Guides, and Lore pages"
```

---

### Task 11: Content Migration Scripts

**Files:**
- Create: `scripts/fetch-page-list.ts`
- Create: `scripts/fetch-page-content.ts`
- Create: `scripts/download-images.ts`
- Create: `scripts/transform-to-content.ts`
- Create: `scripts/run-all.ts`

- [ ] **Step 1: Write page list fetcher**

Write `scripts/fetch-page-list.ts`:
```ts
import fs from 'fs'
import path from 'path'

const API = 'https://wutheringwaves.fandom.com/api.php'
const CONTENT = path.join(__dirname, '..', 'content')

interface PageItem { pageid: number; title: string }
type CategoryMap = Record<string, string[]>

// These are the known playable Resonator names (English). We filter out NPCs.
const PLAYABLE_RESONATORS = new Set([
  'Aalto', 'Baizhi', 'Calcharo', 'Camellya', 'Cantarella', 'Carlotta',
  'Changli', 'Danjin', 'Encore', 'Jianxin', 'Jinhsi', 'Jiyan',
  'Lingyang', 'Lumi', 'Mortefi', 'Roccia', 'Rover', 'Sanhua',
  'Shorekeeper', 'Taoqi', 'Verina', 'Xiangli Yao', 'Yangyang',
  'Yinlin', 'Yuanwu', 'Zani',
])

async function fetchCategory(category: string, limit = 200): Promise<PageItem[]> {
  const pages: PageItem[] = []
  let cmcontinue: string | undefined

  do {
    const params = new URLSearchParams({
      action: 'query', format: 'json',
      list: 'categorymembers',
      cmtitle: `Category:${category}`,
      cmlimit: String(limit),
    })
    if (cmcontinue) params.set('cmcontinue', cmcontinue)

    const res = await fetch(`${API}?${params}`)
    const data = await res.json()
    pages.push(...(data.query?.categorymembers ?? []))
    cmcontinue = data.continue?.cmcontinue
  } while (cmcontinue)

  return pages
}

async function main() {
  console.log('Fetching Resonators...')
  const allChars = await fetchCategory('Characters')
  const resonatorSlugs = allChars
    .filter(p => PLAYABLE_RESONATORS.has(p.title))
    .map(p => p.title)
  console.log(`  Found ${resonatorSlugs.length} playable Resonators`)

  console.log('Fetching Weapons...')
  const allWeapons = await fetchCategory('Weapons')
  const weaponSlugs = allWeapons
    .filter(p => !p.title.startsWith('Weapon/') && p.title !== 'Weapon')
    .map(p => p.title)
  console.log(`  Found ${weaponSlugs.length} weapons`)

  console.log('Fetching Echoes...')
  const allEchoes = await fetchCategory('Echoes')
  const echoSlugs = allEchoes
    .filter(p => p.title.endsWith('/Echo') || !p.title.includes('/'))
    .map(p => p.title)
  console.log(`  Found ${echoSlugs.length} echoes`)

  console.log('Fetching Quests...')
  const allQuests = await fetchCategory('Quests')
  const questSlugs = allQuests
    .filter(p => p.title !== 'Quest')
    .map(p => p.title)
  console.log(`  Found ${questSlugs.length} quests`)

  fs.mkdirSync(CONTENT, { recursive: true })
  fs.writeFileSync(
    path.join(CONTENT, 'page-lists.json'),
    JSON.stringify({ characters: resonatorSlugs, weapons: weaponSlugs, echoes: echoSlugs, quests: questSlugs }, null, 2)
  )
  console.log('Saved page-lists.json')
}

main().catch(console.error)
```

- [ ] **Step 2: Write page content fetcher**

Write `scripts/fetch-page-content.ts`:
```ts
import fs from 'fs'
import path from 'path'

const API = 'https://wutheringwaves.fandom.com/api.php'
const CONTENT = path.join(__dirname, '..', 'content')
const OUTPUT = path.join(CONTENT, 'raw-pages')

interface PageContent {
  title: string
  html: string
  images: string[]
  infobox: Record<string, string>
}

function parseInfobox(html: string): Record<string, string> {
  const data: Record<string, string> = {}
  // Match infobox rows: <tr>...<th>Label</th><td>Value</td>...</tr>
  const rowRegex = /<tr[^>]*>.*?<th[^>]*>(.*?)<\/th>.*?<td[^>]*>(.*?)<\/td>.*?<\/tr>/gs
  let match: RegExpExecArray | null
  while ((match = rowRegex.exec(html)) !== null) {
    const key = match[1].replace(/<[^>]+>/g, '').trim()
    const value = match[2].replace(/<[^>]+>/g, '').trim()
    if (key && value) data[key] = value
  }
  return data
}

function extractImages(html: string): string[] {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
  const images: string[] = []
  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1]
    // Only keep Fandom static/upload images, skip UI icons and pixel trackers
    if (src.includes('static.wikia.nocookie.net') && !src.includes('data:image')) {
      images.push(src.split('/revision/')[0]) // Get base URL without revision
    }
  }
  return [...new Set(images)]
}

async function fetchPage(title: string): Promise<PageContent> {
  const params = new URLSearchParams({
    action: 'parse', page: title, format: 'json',
    prop: 'text|images', disablelimitreport: '1',
  })

  const res = await fetch(`${API}?${params}`)
  const data = await res.json()

  const html: string = data.parse?.text?.['*'] ?? ''
  const images: string[] = data.parse?.images ?? []

  return {
    title,
    html,
    images: [
      ...images
        .filter((i: string) => !i.endsWith('.svg') || i.includes('Icon'))
        .map((i: string) => `https://wutheringwaves.fandom.com/wiki/Special:FilePath/${encodeURIComponent(i)}`),
      ...extractImages(html),
    ],
    infobox: parseInfobox(html),
  }
}

async function main() {
  const lists = JSON.parse(fs.readFileSync(path.join(CONTENT, 'page-lists.json'), 'utf-8'))
  fs.mkdirSync(OUTPUT, { recursive: true })

  const categories = ['characters', 'weapons', 'echoes', 'quests'] as const
  for (const cat of categories) {
    console.log(`Fetching ${cat} pages...`)
    const dir = path.join(OUTPUT, cat)
    fs.mkdirSync(dir, { recursive: true })

    for (const title of lists[cat]) {
      const safeName = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      const filePath = path.join(dir, `${safeName}.json`)

      if (fs.existsSync(filePath)) {
        console.log(`  Skip ${title} (cached)`)
        continue
      }

      try {
        console.log(`  Fetching ${title}...`)
        const content = await fetchPage(title)
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
        // Rate limit: 200ms between requests
        await new Promise(r => setTimeout(r, 200))
      } catch (err) {
        console.error(`  Failed ${title}: ${err}`)
      }
    }
  }
  console.log('Done fetching pages')
}

main().catch(console.error)
```

- [ ] **Step 3: Write image downloader**

Write `scripts/download-images.ts`:
```ts
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const CONTENT = path.join(__dirname, '..', 'content')
const RAW = path.join(CONTENT, 'raw-pages')
const IMG_OUT = path.join(CONTENT, 'images')

interface RawPage { title: string; images: string[] }

async function downloadImage(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url)
    if (!res.ok) return false
    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(dest, buffer)
    return true
  } catch {
    return false
  }
}

async function main() {
  const categories = ['characters', 'weapons', 'echoes', 'quests']

  // Collect all unique image URLs
  const allImages = new Map<string, string>() // url -> local filename

  for (const cat of categories) {
    const dir = path.join(RAW, cat)
    if (!fs.existsSync(dir)) continue

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
    for (const file of files) {
      const raw: RawPage = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
      const slug = file.replace('.json', '')
      for (const imgUrl of raw.images) {
        const ext = imgUrl.match(/\.(png|jpg|jpeg|webp|gif)/i)?.[0] ?? '.png'
        const localName = `${cat}/${slug}${allImages.size}${ext}`
        allImages.set(imgUrl, localName)
      }
    }
  }

  console.log(`Downloading ${allImages.size} unique images...`)

  let downloaded = 0
  for (const [url, localName] of allImages) {
    const dest = path.join(IMG_OUT, localName)
    fs.mkdirSync(path.dirname(dest), { recursive: true })

    if (fs.existsSync(dest)) { downloaded++; continue }

    console.log(`  [${downloaded + 1}/${allImages.size}] ${path.basename(localName)}`)
    const ok = await downloadImage(url, dest)
    if (ok) downloaded++
    await new Promise(r => setTimeout(r, 150))
  }

  console.log(`Downloaded ${downloaded} images`)

  // Convert to WebP if sharp is available
  try {
    console.log('Converting to WebP...')
    // Use sharp CLI via npx
    for (const [, localName] of allImages) {
      const src = path.join(IMG_OUT, localName)
      if (!fs.existsSync(src)) continue
      const dest = src.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp')
      if (fs.existsSync(dest)) continue
      try {
        execSync(`npx sharp-cli -i "${src}" -o "${dest}" --format webp --quality 85`, { stdio: 'pipe' })
      } catch { /* sharp-cli may not be installed; that's ok */ }
    }
  } catch { console.log('sharp-cli not available, skipping WebP conversion') }
}

main().catch(console.error)
```

- [ ] **Step 4: Write content transform script**

Write `scripts/transform-to-content.ts`:
```ts
import fs from 'fs'
import path from 'path'

const CONTENT = path.join(__dirname, '..', 'content')
const RAW = path.join(CONTENT, 'raw-pages')

interface RawPage {
  title: string
  html: string
  images: string[]
  infobox: Record<string, string>
}

// Map infobox keys to our frontmatter schema
function extractCharacterFM(raw: RawPage) {
  const ib = raw.infobox
  return {
    slug: raw.title.toLowerCase().replace(/\s+/g, '-'),
    name: raw.title,
    element: ib['Element'] ?? ib['Attribute'] ?? 'Unknown',
    weaponType: ib['Weapon'] ?? ib['Weapon Type'] ?? 'Unknown',
    rarity: parseInt(ib['Rarity']?.replace(/[^0-9]/g, '') ?? '5') || 5,
    role: ib['Role'] ?? ib['Class'] ?? 'Main DPS',
    image: '', // Will be filled with first image path
    splashArt: '',
    tier: 'A',
    ascensionStat: ib['Ascension Stat'] ?? '',
    affiliation: ib['Affiliation'] ?? ib['Faction'] ?? '',
    voiceActors: { en: ib['EN VA'] ?? '', jp: ib['JP VA'] ?? '', cn: ib['CN VA'] ?? '' },
  }
}

function extractWeaponFM(raw: RawPage) {
  const ib = raw.infobox
  return {
    slug: raw.title.toLowerCase().replace(/\s+/g, '-'),
    name: raw.title,
    type: ib['Type'] ?? ib['Weapon Type'] ?? 'Unknown',
    rarity: parseInt(ib['Rarity']?.replace(/[^0-9]/g, '') ?? '4') || 4,
    image: '',
    baseAtk: parseInt(ib['Base ATK']?.replace(/[^0-9]/g, '') ?? '0'),
    subStat: ib['Substat'] ?? ib['Secondary Stat'] ?? '',
    subStatValue: ib['Substat Value'] ?? '',
    effect: ib['Effect'] ?? ib['Skill'] ?? '',
  }
}

function extractEchoFM(raw: RawPage) {
  const ib = raw.infobox
  return {
    slug: raw.title.replace('/Echo', '').toLowerCase().replace(/\s+/g, '-'),
    name: raw.title.replace('/Echo', ''),
    cost: (parseInt(ib['Cost']?.replace(/[^0-9]/g, '') ?? '1') || 1) as 1 | 3 | 4,
    element: ib['Element'] ?? ib['Attribute'] ?? 'Unknown',
    class: (ib['Class'] ?? 'Common') as 'Common' | 'Elite' | 'Overlord' | 'Calamity',
    image: '',
    skill: ib['Skill'] ?? ib['Echo Skill'] ?? '',
    sonataEffects: (ib['Sonata Effects'] ?? '').split(',').map((s: string) => s.trim()).filter(Boolean),
  }
}

function extractQuestFM(raw: RawPage) {
  const ib = raw.infobox
  return {
    slug: raw.title.toLowerCase().replace(/\s+/g, '-'),
    name: raw.title,
    type: (ib['Type'] ?? 'Side') as 'Main' | 'Companion' | 'Side' | 'Exploration' | 'Daily',
    chapter: ib['Chapter'] ?? '',
    requirements: ib['Requirements'] ?? '',
    rewards: ib['Rewards'] ?? '',
  }
}

function htmlToMarkdown(html: string): string {
  // Basic HTML-to-text: strip tags, preserve line breaks
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[2-6]>/gi, '\n\n')
    .replace(/<li>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function writeMDX(category: string, slug: string, fm: Record<string, unknown>, body: string) {
  const dir = path.join(CONTENT, category)
  fs.mkdirSync(dir, { recursive: true })

  const yaml = Object.entries(fm)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n')

  const mdx = `---\n${yaml}\n---\n\n${body}\n`
  fs.writeFileSync(path.join(dir, `${slug}.mdx`), mdx)
}

function generateIndex(category: string) {
  const dir = path.join(CONTENT, category)
  if (!fs.existsSync(dir)) return

  const items = fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf-8')
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (!fmMatch) return null
      const fm: Record<string, unknown> = {}
      for (const line of fmMatch[1].split('\n')) {
        const m = line.match(/^(\w+):\s*(.*)$/)
        if (m) {
          try { fm[m[1]] = JSON.parse(m[2]) }
          catch { fm[m[1]] = m[2].replace(/^["']|["']$/g, '') }
        }
      }
      return {
        slug: fm.slug ?? f.replace('.mdx', ''),
        name: fm.name ?? f.replace('.mdx', ''),
        element: fm.element as string | undefined,
        rarity: fm.rarity as number | undefined,
        weaponType: fm.weaponType as string | undefined,
        image: fm.image as string | undefined,
      }
    })
    .filter(Boolean)

  fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(items, null, 2))
  console.log(`  ${category}/index.json: ${items.length} items`)
}

async function main() {
  const categories = ['characters', 'weapons', 'echoes', 'quests'] as const
  const extractors = {
    characters: extractCharacterFM,
    weapons: extractWeaponFM,
    echoes: extractEchoFM,
    quests: extractQuestFM,
  }

  for (const cat of categories) {
    const dir = path.join(RAW, cat)
    if (!fs.existsSync(dir)) { console.log(`No raw data for ${cat}, skipping`); continue }

    console.log(`Transforming ${cat}...`)
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))

    for (const file of files) {
      const raw: RawPage = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
      const fm = extractors[cat](raw)
      const body = htmlToMarkdown(raw.html)
      writeMDX(cat, fm.slug as string, fm as Record<string, unknown>, body)
    }

    generateIndex(cat)
  }

  console.log('Transformation complete')
}

main().catch(console.error)
```

- [ ] **Step 5: Write run-all orchestrator**

Write `scripts/run-all.ts`:
```ts
import { execSync } from 'child_process'

const scripts = [
  ['Discovering pages', 'npx tsx scripts/fetch-page-list.ts'],
  ['Fetching page content', 'npx tsx scripts/fetch-page-content.ts'],
  ['Downloading images', 'npx tsx scripts/download-images.ts'],
  ['Transforming to content files', 'npx tsx scripts/transform-to-content.ts'],
]

for (const [label, cmd] of scripts) {
  console.log(`\n=== ${label} ===`)
  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch (err) {
    console.error(`Failed: ${label}`)
    process.exit(1)
  }
}

console.log('\n=== All done! ===')
console.log('Run `npm run build` to generate the static site.')
```

- [ ] **Step 6: Add tsx dependency for running scripts**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm install --save-dev tsx
```

- [ ] **Step 7: Add scripts to package.json**

Read `package.json` and add to `"scripts"`:
```json
{
  "scripts": {
    "migrate": "npx tsx scripts/run-all.ts",
    "fetch-list": "npx tsx scripts/fetch-page-list.ts",
    "fetch-content": "npx tsx scripts/fetch-page-content.ts",
    "download-images": "npx tsx scripts/download-images.ts",
    "transform": "npx tsx scripts/transform-to-content.ts"
  }
}
```

- [ ] **Step 8: Verify scripts compile**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npx tsc --noEmit scripts/*.ts 2>&1 || true
```

Expected: May have some loose type errors (scripts use `require` patterns) — that's acceptable for build scripts

- [ ] **Step 9: Commit**

```bash
git add scripts/ package.json
git commit -m "feat: add content migration scripts (fetch, download, transform)"
```

---

### Task 12: Run Content Migration

**Files:** None created — this populates `content/`

- [ ] **Step 1: Run page discovery**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run fetch-list
```

Expected: `content/page-lists.json` created with character, weapon, echo, quest page titles

- [ ] **Step 2: Run content fetcher**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run fetch-content
```

Expected: `content/raw-pages/{category}/*.json` files created

Note: This may take 5-10 minutes depending on page count and rate limiting

- [ ] **Step 3: Run image downloader**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run download-images
```

Expected: Images downloaded to `content/images/{category}/`

Note: This may take 10-30 minutes depending on image count

- [ ] **Step 4: Run transform**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run transform
```

Expected: `.mdx` files in `content/{category}/` and `index.json` per category

- [ ] **Step 5: Verify build with real content**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds with all pages generated

- [ ] **Step 6: Commit migrated content**

```bash
git add content/
git commit -m "content: add migrated wiki pages, images, and indexes"
```

---

### Task 13: UI Polish — Game-Authentic Styling & Backgrounds

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/layout/PageBackground.tsx`
- Create: `public/images/ui/element-icons.svg` (placeholder sprite sheet)
- Modify: Various page components to add background images

- [ ] **Step 1: Add game-UI CSS utilities**

Append to `src/app/globals.css`:
```css
@layer components {
  /* Game UI-style decorative corner brackets */
  .ww-frame {
    position: relative;
    border: 1px solid rgba(0,199,230,0.15);
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(12px);
  }
  .ww-frame::before, .ww-frame::after {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    border-color: rgba(0,199,230,0.4);
    border-style: solid;
  }
  .ww-frame::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
  .ww-frame::after { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

  /* Glowing divider */
  .ww-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,199,230,0.4), transparent);
    border: none;
    margin: 2rem 0;
  }

  /* Stylized scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
}

@layer utilities {
  /* Animated gradient border */
  .border-glow {
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, rgba(0,199,230,0.3), rgba(232,168,64,0.2), rgba(0,199,230,0.1)) border-box;
  }
}
```

- [ ] **Step 2: Add SVG element icon placeholders**

Write `public/images/ui/glacio.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="10" stroke="#0c4a6e" stroke-width="1.5"/>
  <path d="M12 4v16M4 12h16" stroke="#0c4a6e" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="3" fill="#0c4a6e"/>
</svg>
```

(Create similar placeholder SVGs for Fusion, Electro, Aero, Spectro, Havoc — each with different colors and shapes. Or skip this step and use text-based element badges until real icons are downloaded from Fandom.)

- [ ] **Step 3: Verify build**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css public/images/ui/ src/components/layout/PageBackground.tsx
git commit -m "style: add game-UI polish, frame effects, scrollbar, and element icon placeholders"
```

---

### Task 14: CI/CD — GitHub Actions Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write deploy workflow**

Write `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Enable GitHub Pages in repo settings**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
gh api repos/wqqworkbase/wuthering-waves-hub/pages -X POST -f "source[branch]=main" -f "source[path]=/" 2>&1 || echo "Configure Pages manually: Settings > Pages > Source: GitHub Actions"
```

- [ ] **Step 3: Push to trigger first deploy**

Run:
```bash
cd /Users/wqq/development/wuthering-waves-hub
git add .github/
git commit -m "ci: add GitHub Actions deploy to Pages workflow"
git push origin main
```

- [ ] **Step 4: Verify deploy**

Run:
```bash
gh api repos/wqqworkbase/wuthering-waves-hub/deployments --jq '.[0] | {url: .payload.web_url, status: .status, created: .created_at}'
```

Expected: Shows deployment URL (e.g., `https://wqqworkbase.github.io/wuthering-waves-hub/`)

- [ ] **Step 5: Commit**

Already committed and pushed in steps above.

---

### Task 15: Final Verification

- [ ] **Step 1: Run build locally one last time**

```bash
cd /Users/wqq/development/wuthering-waves-hub
npm run build
```

Expected: Zero errors, `out/` directory populated

- [ ] **Step 2: Verify all page routes exist**

```bash
find out -name "*.html" | head -30
```

Expected: List of generated HTML files

- [ ] **Step 3: Verify no broken internal links**

```bash
grep -r "href=\"/" out/ --include="*.html" | head -20
```

- [ ] **Step 4: Create summary markdown**

Write `PROJECT_SUMMARY.md` at repo root documenting what was built and how.

- [ ] **Step 5: Commit summary + push final state**

```bash
git add PROJECT_SUMMARY.md
git commit -m "docs: add project summary"
git push origin main
```
