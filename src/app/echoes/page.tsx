import type { Metadata } from 'next'
import { loadIndex } from '@/lib/content-loader'
import PageBackground from '@/components/layout/PageBackground'
import Sidebar from '@/components/layout/Sidebar'
import AdSlot from '@/components/ads/AdSlot'
import EchoesClient from './EchoesClient'

export const metadata: Metadata = { title: 'Echoes — WUWA.wiki' }

export default function EchoesPage() {
  const index = loadIndex('echoes')

  return (
    <PageBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="section-label">Equipment</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Echoes</h1>
        <div className="grid lg:grid-cols-[220px_1fr_300px] gap-6">
          <Sidebar />
          <EchoesClient index={index} />
          <aside className="space-y-4"><AdSlot slotId="" size="300x250" /></aside>
        </div>
      </div>
    </PageBackground>
  )
}
