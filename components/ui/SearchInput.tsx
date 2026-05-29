import type { InputHTMLAttributes } from 'react'

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export default function SearchInput({
  label = 'Поиск',
  id = 'search',
  className = '',
  ...props
}: SearchInputProps): JSX.Element {
  return (
    <label className={`ui-search ${className}`.trim()} htmlFor={id}>
      <span className="sr-only">{label}</span>
      <input id={id} type="search" className="ui-search__input" {...props} />
    </label>
  )
}
