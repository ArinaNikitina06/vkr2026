import type { InputHTMLAttributes, ReactNode } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode
  helperText?: string
}

export default function Checkbox({ label, helperText, className = '', ...props }: CheckboxProps): JSX.Element {
  return (
    <label className={`ui-checkbox ${className}`.trim()}>
      <input type="checkbox" className="ui-checkbox__input" {...props} />
      <span>
        <span className="ui-checkbox__label">{label}</span>
        {helperText && <span className="ui-checkbox__helper">{helperText}</span>}
      </span>
    </label>
  )
}
