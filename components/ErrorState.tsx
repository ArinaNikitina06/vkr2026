import type { ReactNode } from 'react'
import StateBox from './ui/StateBox'

type ErrorStateProps = {
  title?: string
  description?: string
  action?: ReactNode
}

export default function ErrorState({
  title = 'Не удалось загрузить данные',
  description = 'Проверьте подключение и попробуйте ещё раз.',
  action
}: ErrorStateProps): JSX.Element {
  return (
    <StateBox
      title={title}
      description={description}
      action={action}
      tone="error"
      role="alert"
    />
  )
}
