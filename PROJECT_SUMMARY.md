# Wuthering Waves Resource Hub — Project Summary

## What Was Built

A fan-made English-language resource hub for Wuthering Waves (鸣潮) overseas players, replicating content from the Fandom Wiki with game-authentic UI/UX. Fully static Next.js site deployed to GitHub Pages.

**Live preview (local):** `http://localhost:3457/`

## Key Stats

| Metric | Value |
|--------|-------|
| Total pages generated | **792** |
| Content pages (MDX) | **780** (26 chars + 131 weapons + 177 echoes + 446 quests) |
| Images downloaded | **819** images from Fandom Wiki CDN |
| Source files (code) | ~40 files (components, pages, lib, scripts, config) |
| Build time | ~30 seconds |
| Total commits | 12 |

## Tech Stack

- **Next.js 14** (App Router) with `output: 'export'` for full static generation
- **TypeScript** (strict mode)
- **Tailwind CSS v3** with custom Wuthering Waves theme tokens (cyan/gold palette)
- **MDX** via `@next/mdx` for content files with YAML frontmatter
- **GitHub Pages** deployment via GitHub Actions

## Content Migration Pipeline

Content was sourced from the [Wuthering Waves Fandom Wiki](https://wutheringwaves.fandom.com) using the public MediaWiki API:

1. **`npm run fetch-list`** — Queries `api.php?action=query&list=categorymembers` for Characters, Weapons, Echoes, Quests. Filters NPCs to isolate 26 playable Resonators.
2. **`npm run fetch-content`** — Queries `api.php?action=parse&page=<title>&prop=text|images` for each page. Extracts infobox data (stats, rarity, element) via regex and image URLs.
3. **`npm run download-images`** — Downloads images from Fandom's static CDN to `content/images/`. Attempts WebP conversion via `sharp` when available.
4. **`npm run transform`** — Converts raw HTML to MDX with YAML frontmatter, writes to `content/{category}/` and generates `index.json` per category.

All four steps orchestrated via `npm run migrate`.

## Architecture

```
src/
├── app/                    # Next.js App Router pages (all SSG)
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Home page (hero, quick links, ad)
│   ├── characters/
│   │   ├── page.tsx        # Server: loads index → passes to client
│   │   └── [slug]/page.tsx # Detail with generateStaticParams
│   ├── weapons/            # Same pattern as characters
│   ├── echoes/             # Same pattern
│   ├── quests/             # Same pattern
│   ├── tier-list/page.tsx  # Static tier table placeholder
│   ├── game-mechanics/     # Static guide page
│   └── lore/               # Static lore page
├── components/
│   ├── layout/             # Navbar, Sidebar, Footer, PageBackground
│   ├── ui/                 # Badge, SearchBar, Card, Infobox, TierTable
│   ├── ads/                # AdSlot (placeholder ↔ real AdSense toggle)
│   └── content/            # CharacterCard, WeaponCard, EchoCard
├── lib/
│   ├── types.ts            # Shared TypeScript types
│   ├── constants.ts        # Game constants (elements, colors, icons)
│   ├── content-loader.ts   # File-based content loading (server only)
│   ├── content-utils.ts    # Search/filter utilities (client-safe)
│   └── ads.ts              # AdSense config
└── styles/
    └── globals.css         # Tailwind + WW theme + game-UI utilities
```

## Visual Design

- **Color palette**: Cyan primary (#00c7e6), gold accent (#e8a840), bright backgrounds (#f3f5f9)
- **Game-authentic UI**: Glass-morphism navbar, card hover glow effects, stylized scrollbars, decorative corner brackets (`.ww-frame`), glowing dividers
- **Backgrounds**: Per-page blurred gradient/hero image support via `PageBackground` component
- **Typography**: Inter (body) + Noto Sans SC fallback
- **Responsive**: Mobile-first with collapsible hamburger menu, adaptive card grids
- **Element icons**: Placeholder SVGs for all 6 elements + 5 weapon types (Ready to replace with real game icons from Fandom)

## Ad Integration

- `AdSlot` component with environment-variable toggle (`NEXT_PUBLIC_ADS_ENABLED`)
- Development mode: dashed-border placeholder with "Advertisement" label
- Production mode: real Google AdSense `<ins>` elements
- Three ad positions: top leaderboard (728×90), sidebar (300×250), in-content (728×90)
- Env vars: `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`, `NEXT_PUBLIC_ADSENSE_TOP_SLOT`, `NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT`

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Checkout + Node 20 setup
2. `npm ci` + `npm run build`
3. `actions/upload-pages-artifact` + `actions/deploy-pages`

## How to Run Locally

```bash
cd wuthering-waves-hub
npm install
npm run build        # Build to out/
npx serve out/       # Or: python3 -m http.server -d out/ 3457
```

To re-run content migration (refresh from Fandom Wiki):
```bash
npm run migrate      # Full pipeline: fetch-list → fetch-content → download-images → transform
npm run build        # Rebuild with fresh content
```

## How to Deploy

1. Merge `worktree-wuthering-waves-hub` into `main`
2. Push `main` to trigger GitHub Actions deploy
3. Or manually: `npm run build && gh pages deploy out/`

## Known Limitations

- Images are downloaded as-is from Fandom CDN (mixed PNG/JPG/GIF); WebP conversion requires `sharp` to be installed and functional
- Element system only covers 6 base elements; "Multiple" (e.g., Rover) is handled via fallback styling
- Tier list data is placeholder — needs manual curation after migration
- Game mechanics and lore pages have placeholder content — Fandom Wiki structure differs from our page templates
- Fandom Wiki is behind Cloudflare for direct web access (API works fine)

## Future Expansion

- Fan creation (二创) sections — architecture ready, content pending
- Real game icons from Fandom to replace placeholder SVGs
- Search functionality (client-side already scaffolded, needs Algolia/Lunr for 780-page scale)
- Dark mode toggle
- Dynamic tier list from community data
- Multi-language support
