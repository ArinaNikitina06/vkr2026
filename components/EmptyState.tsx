import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps): JSX.Element {
  return (
    <div className="state-box">
      <h3 className="state-box__title">{title}</h3>
      {description && <p className="state-box__description">{description}</p>}
      {action && <div className="state-box__action">{action}</div>}
    </div>
  )
}
