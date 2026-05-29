import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps): JSX.Element {
  const classes = [
    'ui-button',
    `ui-button--${variant}`,
    fullWidth ? 'ui-button--full' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
