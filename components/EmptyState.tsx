import type { ReactNode } from 'react'
import StateBox from './ui/StateBox'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps): JSX.Element {
  return (
    <StateBox title={title} description={description} action={action} />
  )
}
