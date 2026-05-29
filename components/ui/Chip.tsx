import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  active?: boolean
}

export default function Chip({
  children,
  active = false,
  className = '',
  type = 'button',
  ...props
}: ChipProps): JSX.Element {
  return (
    <button
      type={type}
      className={`ui-chip ${active ? 'ui-chip--active' : 'ui-chip--inactive'} ${className}`.trim()}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  )
}
