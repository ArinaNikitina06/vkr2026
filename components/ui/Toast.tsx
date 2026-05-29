import type { ReactNode } from 'react'

type ToastProps = {
  children: ReactNode
  tone?: 'success' | 'error' | 'neutral'
}

export default function Toast({ children, tone = 'neutral' }: ToastProps): JSX.Element {
  return (
    <div className={`ui-toast ui-toast--${tone}`} role="status">
      {children}
    </div>
  )
}
