import Link from 'next/link'
import type { ReactNode } from 'react'

type TagProps = {
  children: ReactNode
  className?: string
  href?: string
}

export default function Tag({ children, className, href }: TagProps): JSX.Element {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return <span className={className}>{children}</span>
}
