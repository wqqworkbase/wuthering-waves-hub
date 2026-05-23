import type { ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  href?: string
  children: ReactNode
  className?: string
}

export default function Card({ href, children, className = '' }: Props) {
  const classes = `card-ww overflow-hidden ${className}`

  if (href) {
    return (
      <Link href={href} className={`${classes} block cursor-pointer`}>
        {children}
      </Link>
    )
  }

  return <div className={classes}>{children}</div>
}
