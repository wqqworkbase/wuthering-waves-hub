import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WUWA.wiki — Wuthering Waves Resource Hub',
  description: 'Your ultimate companion for Resonator builds, weapon stats, echo guides, and the latest Wuthering Waves event tracker.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
