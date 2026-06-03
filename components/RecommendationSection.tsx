import type { ReactNode } from 'react'

type RecommendationSectionProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export default function RecommendationSection({
  title,
  description,
  action,
  children
}: RecommendationSectionProps): JSX.Element {
  return (
    <section className="recommendation-section" aria-labelledby={`section-${title}`}>
      <div className="section-heading">
        <div>
          <h2 id={`section-${title}`} className="section-title">
            {title}
          </h2>
          {description && <p className="section-subtitle section-subtitle--offset">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
