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
