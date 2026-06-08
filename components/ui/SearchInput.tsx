import type { InputHTMLAttributes } from 'react'

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string
  label?: string
  wrapperClassName?: string
}

export default function SearchInput({
  inputClassName = '',
  label = 'Поиск',
  id = 'search',
  wrapperClassName = '',
  ...props
}: SearchInputProps): JSX.Element {
  return (
    <label className={`ui-search ${wrapperClassName}`.trim()} htmlFor={id}>
      <span className="sr-only">{label}</span>
      <input id={id} type="search" className={`ui-search__input ${inputClassName}`.trim()} {...props} />
    </label>
  )
}
