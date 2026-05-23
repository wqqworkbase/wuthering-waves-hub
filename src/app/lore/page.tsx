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
