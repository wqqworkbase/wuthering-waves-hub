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
