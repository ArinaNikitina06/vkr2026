import type { AriaRole, ReactNode } from 'react'

type StateBoxProps = {
  action?: ReactNode
  description?: string
  role?: AriaRole
  title: string
  tone?: 'neutral' | 'error'
}

export default function StateBox({
  action,
  description,
  role,
  title,
  tone = 'neutral'
}: StateBoxProps): JSX.Element {
  const className = [
    'state-box',
    tone === 'error' ? 'state-box--error' : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={className} role={role}>
      <h3 className="state-box__title">{title}</h3>
      {description && <p className="state-box__description">{description}</p>}
      {action && <div className="state-box__action">{action}</div>}
    </div>
  )
}
