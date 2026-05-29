type SkeletonCardProps = {
  count?: number
}

export default function SkeletonCard({ count = 1 }: SkeletonCardProps): JSX.Element {
  return (
    <div className="grid-cards" aria-label="Загрузка курсов">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-card__media"></div>
          <div className="skeleton-card__body">
            <div className="skeleton-card__line skeleton-card__line--short"></div>
            <div className="skeleton-card__line"></div>
            <div className="skeleton-card__line"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
