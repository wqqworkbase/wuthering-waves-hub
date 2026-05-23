import type { Metadata } from 'next'
import { loadIndex } from '@/lib/content-loader'
import type { ContentIndexItem } from '@/lib/types'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import Infobox from '@/components/ui/Infobox'
import AdSlot from '@/components/ads/AdSlot'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  const index = loadIndex('quests')
  if (index.length === 0) return [{ slug: '_placeholder' }]
  return index.map((item: ContentIndexItem) => ({ slug: item.slug }))
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
            <div className="flex items-center gap-3 mb-6">
              {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded" />}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{item.name}</h1>
                {item.rarity && <span className="text-xs font-bold text-amber-400">{'★'.repeat(item.rarity)}</span>}
              </div>
            </div>
            <div className="prose prose-slate max-w-none bg-ww-surface rounded-ww shadow-ww-sm border border-ww-border p-6">
              <p className="text-sm text-ww-muted italic">Full quest data loads from MDX after migration.</p>
            </div>
            <div className="mt-6"><AdSlot slotId="" size="728x90" /></div>
          </div>
          <aside className="space-y-4">
            <Infobox title="Quest Info" image={item.image} rows={[
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
