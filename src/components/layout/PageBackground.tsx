import type { ReactNode } from 'react'

interface Props {
  src?: string
  children: ReactNode
}

export default function PageBackground({ src, children }: Props) {
  return (
    <div className="relative min-h-screen">
      {src ? (
        <div className="fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-15 blur-2xl scale-110"
            style={{ backgroundImage: `url(${src})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ww-bg/60 via-ww-bg/80 to-ww-bg" />
        </div>
      ) : (
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-50 via-ww-bg to-ww-bg" />
      )}
      {children}
    </div>
  )
}
