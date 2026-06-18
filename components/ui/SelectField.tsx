import type { SelectHTMLAttributes } from 'react'

type SelectOption = {
  disabled?: boolean
  label: string
  value: string
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  id: string
  label: string
  options: SelectOption[]
  labelClassName?: string
  selectClassName?: string
  wrapperClassName?: string
}

export default function SelectField({
  id,
  label,
  labelClassName = 'settings-label',
  options,
  selectClassName = 'settings-input',
  wrapperClassName = 'form-group',
  ...props
}: SelectFieldProps): JSX.Element {
  return (
    <div className={wrapperClassName}>
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <select id={id} className={selectClassName} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
