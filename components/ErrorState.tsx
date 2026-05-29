import type { ReactNode } from 'react'

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
    <div className="state-box state-box--error" role="alert">
      <h3 className="state-box__title">{title}</h3>
      <p className="state-box__description">{description}</p>
      {action && <div className="state-box__action">{action}</div>}
    </div>
  )
}
