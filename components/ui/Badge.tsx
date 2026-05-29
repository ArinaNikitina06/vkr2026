import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning'
}

export default function Badge({ children, tone = 'neutral' }: BadgeProps): JSX.Element {
  return (
    <span className={`ui-badge ui-badge--${tone}`}>
      {children}
    </span>
  )
}
