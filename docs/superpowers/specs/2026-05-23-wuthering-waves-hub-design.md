---
date: 2026-05-23
topic: wuthering-waves-resource-hub
status: approved
---

# Wuthering Waves Resource Hub — Design Spec

## Overview

A fan-made English-language resource hub for Wuthering Waves (鸣潮) overseas players. Replicates content from the Fandom Wiki with a brighter, anime-inspired visual style matching the game's in-game UI aesthetic. First version is a statically-exported Next.js site deployed to GitHub Pages.

## Goals

- 1:1 content replication from Wuthering Waves Fandom Wiki (medium coverage)
- Game-authentic UI/UX with bright anime aesthetic, character splash backgrounds, original icons
- Ad-ready with Google AdSense integration behind a feature flag
- Fully static build for fast, free hosting

## Non-Goals (v1)

- Fan creation (二创) sections — shelved for future
- Backend/API — pure static site
- User accounts or interactive comments

---

## Scope: Medium Coverage (~100-140 pages)

| Section | Pages | Notes |
|---------|-------|-------|
| Home | 1 | Hero, featured content, event banners, tier list teaser |
| Characters | ~30 | List + individual Resonator detail pages |
| Weapons | ~70 | List + individual weapon detail pages |
| Echoes | ~90 | List + individual echo detail pages |
| Quests | ~20 | Main story + companion quests |
| Game Mechanics | 3-5 | Combat basics, gacha system, progression |
| Tier List | 1 | Community meta rankings |
| Lore | 1-2 | World overview, factions |

Pages with repeating structure (characters, weapons, echoes) are generated from content files via dynamic routes + `generateStaticParams`.

---

## Architecture

```
wuthering-waves-hub/
├── scripts/                     # Content migration pipeline
│   ├── fetch-page-list.ts       # Discover all pages via API
│   ├── fetch-page-content.ts    # Get wikitext/HTML per page
│   ├── download-images.ts       # Bulk image download + optimize
│   └── transform-to-content.ts  # API response → MDX/JSON content files
├── content/                     # Migrated content (committed, read at build time)
│   ├── characters/
│   │   ├── carlotta.mdx
│   │   └── ...
│   ├── weapons/
│   ├── echoes/
│   ├── quests/
│   └── images/                  # Local game assets & icons
├── src/
│   ├── pages/                   # App Router pages (SSG via output:'export')
│   │   ├── index.tsx
│   │   ├── characters/
│   │   │   ├── index.tsx
│   │   │   └── [slug].tsx
│   │   ├── weapons/
│   │   ├── echoes/
│   │   ├── quests/
│   │   ├── tier-list.tsx
│   │   ├── game-mechanics/
│   │   └── lore/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Sticky glass-morph nav with search
│   │   │   ├── Sidebar.tsx       # Left category nav
│   │   │   ├── Footer.tsx
│   │   │   └── PageBackground.tsx # Blurred character/world backdrop
│   │   ├── ui/
│   │   │   ├── Card.tsx          # Character/weapon/echo cards
│   │   │   ├── Infobox.tsx       # Fandom-style data table (right rail)
│   │   │   ├── TierTable.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── Badge.tsx        # Rarity, element, role badges
│   │   ├── ads/
│   │   │   ├── AdSlot.tsx        # Conditional: placeholder vs real ad
│   │   │   └── AdBanner.tsx      # Top leaderboard variant
│   │   └── content/
│   │       ├── CharacterCard.tsx
│   │       ├── WeaponCard.tsx
│   │       └── EchoCard.tsx
│   ├── lib/
│   │   ├── ads.ts               # Google AdSense SDK wrapper
│   │   ├── content-loader.ts    # Read & parse content/ files at build time
│   │   ├── constants.ts         # Elements, rarities, weapon types
│   │   └── types.ts             # Shared TypeScript types
│   └── styles/
│       └── globals.css          # Tailwind + custom WW theme tokens
├── public/
│   └── images/                  # Unprocessed static assets (logo, favicon)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Tech Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | Next.js 14 (App Router) | SSG with `output: 'export'`, file-based routing |
| Styling | Tailwind CSS v4 | Fast iteration, theme tokens via CSS variables |
| Language | TypeScript (strict) | Type safety across content types |
| Content | MDX (`.mdx` files in `content/`) | Rich content with embedded React components |
| Content Fetch | MediaWiki API (`api.php`) | Structured JSON, no scraping needed for text |
| Image Pipeline | Custom download script + `sharp` | Resize, convert to WebP, generate blur placeholders |
| Ads | Google AdSense via `next/script` | Wrapped in `AdSlot` with `NEXT_PUBLIC_ADS_ENABLED` gate |
| Hosting | GitHub Pages | Free, static-optimized, custom domain support |

---

## Visual Design

### Color Palette (Wuthering Waves In-Game UI)

| Token | Hex | Usage |
|-------|-----|-------|
| Cyan primary | `#00c7e6` | Links, active states, buttons, glow effects |
| Cyan light | `#5ce0f5` | Hover states, subtle highlights |
| Gold accent | `#e8a840` | S-tier badges, call-to-action accents |
| Background | `#f3f5f9` | Page base |
| Card surface | `#ffffff` | Cards, panels |
| Nav surface | `rgba(255,255,255,0.85)` | Glass-morph navbar |
| Text primary | `#1e293b` | Body text |
| Text muted | `#64748b` | Meta, captions |
| Border | `#e2e8f0` | Dividers, card borders |

### Typography
- **Body/UI**: Inter (Latin) + system fallback
- **Headlines**: Inter with tighter letter-spacing
- **Chinese text**: Noto Sans SC (for any untranslated content)
- **Iconography**: Original Wuthering Waves game icons sourced from Fandom Wiki assets

### Background Treatment
- Per-page backgrounds using blurred/semi-transparent gradient overlays on character splash art or world scene images
- Parallax-lite CSS effect (fixed attachment, low opacity overlay)
- Fallback to solid gradient when no image is available

### Ad Placement Strategy
- **Top banner**: 728×90 leaderboard below hero, above content fold
- **Sidebar**: 300×250 medium rectangle in right sidebar
- **In-content**: Optional 728×90 between content sections
- Development: all slots render as dashed-border placeholder with "Advertisement" label
- Production: set `NEXT_PUBLIC_ADS_ENABLED=true` → placeholders replaced by real AdSense units
- `AdSlot` component handles the toggle; publisher ID and slot IDs configured via env vars

### UI/UX Principles (Game-Authentic)
- Game-authentic icons: element symbols, weapon type icons, rarity stars sourced from Fandom Wiki
- Card hover effects with cyan glow shadow
- Glass-morphism navbar (backdrop-blur + semi-transparent)
- Smooth page transitions and scroll reveal animations
- Mobile-responsive with collapsible sidebar

---

## Content Migration Pipeline

### Phase 1: Discovery
1. Query `api.php?action=query&list=categorymembers` for Characters, Weapons, Echoes, Quests
2. Deduplicate: filter NPCs from playable Resonators (manual curation list)
3. Output: page list JSON per category

### Phase 2: Content Fetch
1. Query `api.php?action=parse&page=<title>&prop=text|images` for each page
2. Parse returned HTML, extract:
   - Infobox data (stats, rarity, element, etc.) → structured JSON
   - Body text → Markdown
   - Image URLs → download queue

### Phase 3: Image Download
1. Download all referenced images via Fandom's static CDN
2. Convert PNG/GIF to WebP via `sharp`
3. Generate low-res blur placeholders (base64, 40px wide)
4. Store in `content/images/` with organized subdirectories

### Phase 4: Transform to Content Files
1. Merge structured data + markdown body → `.mdx` files with YAML frontmatter
2. Write to `content/{category}/{slug}.mdx`
3. Generate `content/{category}/index.json` (list metadata for list pages)

---

## Page Templates

### Home (`/`)
- Hero section with version tag, CTA buttons
- Featured characters carousel (6 cards)
- Active event banners (static for v1)
- Tier list quick-reference table
- Ad slot (top banner)

### Category List (`/characters/`, `/weapons/`, `/echoes/`, `/quests/`)
- Filter bar: element, rarity, weapon type (where applicable)
- Card grid with search
- Ad slot (sidebar)

### Detail Page (`/characters/[slug]`, etc.)
- Infobox (right column): stats table styled per game UI
- Body content (center column): description, skills, lore, builds
- Sidebar: category navigation + ad slot
- Background: character splash art blurred

### Tier List (`/tier-list`)
- Responsive tier table with S+ to C rankings
- Character thumbnails + role tags
- Toggle filters for game modes

---

## Testing

- `vitest` for unit tests (content-loader, transform pipeline)
- Manual visual QA for all page templates
- `next build` must succeed with zero errors (SSG export validation)
- Lighthouse score target: 90+ Performance, 100 Accessibility

---

## Deployment

1. `next build` generates `out/` with pure static HTML/CSS/JS
2. Push to `main` branch
3. GitHub Actions deploys to GitHub Pages (or manual `gh-pages` branch)
4. Custom domain ready (CNAME support)
