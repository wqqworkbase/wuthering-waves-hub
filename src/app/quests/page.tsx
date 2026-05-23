import type { Metadata } from 'next'
import { loadIndex } from '@/lib/content-loader'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import AdSlot from '@/components/ads/AdSlot'
import QuestsClient from './QuestsClient'

export const metadata: Metadata = { title: 'Quests — WUWA.wiki' }

export default function QuestsPage() {
  const index = loadIndex('quests')

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Story</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Quests</h1>
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <QuestsClient index={index} />
          <aside className="space-y-4"><AdSlot slotId="" size="300x250" /></aside>
        </div>
      </div>
    </PageBackground>
  )
}
