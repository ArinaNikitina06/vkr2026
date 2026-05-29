type RecommendationReasonProps = {
  reasons?: string[]
}

export default function RecommendationReason({ reasons = [] }: RecommendationReasonProps): JSX.Element | null {
  if (reasons.length === 0) {
    return null
  }

  return (
    <details className="recommendation-reason">
      <summary className="recommendation-reason__summary">Почему рекомендовано</summary>
      <ul className="recommendation-reason__list">
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </details>
  )
}
