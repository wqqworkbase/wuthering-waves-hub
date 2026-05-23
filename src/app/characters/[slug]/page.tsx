import type { Metadata } from 'next'
import { loadIndex } from '@/lib/content-loader'
import type { ContentIndexItem } from '@/lib/types'
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
  if (index.length === 0) return [{ slug: '_placeholder' }]
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
