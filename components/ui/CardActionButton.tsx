import type { ButtonHTMLAttributes, ReactNode } from 'react'

type CardActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  active?: boolean
}

export default function CardActionButton({
  children,
  active = false,
  className = '',
  type = 'button',
  ...props
}: CardActionButtonProps): JSX.Element {
  const classes = [
    'card__action',
    active ? 'card__action--active' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
