import type { Metadata } from 'next'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import TierTable from '@/components/ui/TierTable'
import AdSlot from '@/components/ads/AdSlot'
import type { Tier } from '@/lib/types'

export const metadata: Metadata = { title: 'Tier List — WUWA.wiki' }

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
