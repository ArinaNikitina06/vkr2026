import Link from 'next/link'
import { useState } from 'react'
import RecommendationReason from './RecommendationReason'

type CourseCardProps = {
  id?: string
  image?: string
  category?: string
  title: string
  description?: string
  tags?: string[]
  duration?: string
  students?: number
  level?: string
  rating?: number
  price?: string
  reasons?: string[]
  variant?: 'compact' | 'full'
  href?: string
  onLike?: (id: string) => void
  onHide?: (id: string) => void
  onBookmark?: (id: string) => void
}

export default function CourseCard({
  id = '1',
  image = 'https://via.placeholder.com/300x200?text=Course',
  category = 'Разработка',
  title = 'Курс',
  description = 'Описание курса',
  tags = [],
  duration = '4ч 20м',
  students = 1200,
  level,
  rating,
  price,
  reasons = [],
  variant = 'full',
  href,
  onLike,
  onHide,
  onBookmark
}: CourseCardProps): JSX.Element {
  const [favorite, setFavorite] = useState(false)
  const [liked, setLiked] = useState(false)

  const handleBookmark = () => {
    setFavorite((value) => !value)
    onBookmark?.(id)
  }

  const handleLike = () => {
    setLiked((value) => !value)
    onLike?.(id)
  }

  const actions = (onLike || onHide) ? (
    <div className="card__actions">
      {onLike && (
        <button
          type="button"
          className={`card__action ${liked ? 'card__action--active' : ''}`}
          aria-pressed={liked}
          onClick={handleLike}
        >
          Нравится
        </button>
      )}
      {onHide && (
        <button type="button" className="card__action" onClick={() => onHide(id)}>
          Скрыть
        </button>
      )}
    </div>
  ) : null

  const content = (
    <div className="card__content">
      <div className="card__header">
        <span className="card__badge">{category}</span>
      </div>

      <h3 className="card__title line-clamp-2">{title}</h3>

      {description && variant === 'full' && (
        <p className="card__description line-clamp-2">{description}</p>
      )}

      {tags.length > 0 && (
        <div className="form-tags mb-3">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="card__attributes">
        {level && <span>{level}</span>}
        {rating && <span>Рейтинг {rating.toFixed(1)}</span>}
        {price && <span>{price}</span>}
      </div>

      <RecommendationReason reasons={reasons} />

      <div className="card__footer">
        {duration && <span>⏱ {duration}</span>}
        {students && <span>🧑‍🎓 +{(students / 1000).toFixed(1)}k</span>}
      </div>
    </div>
  )

  return (
    <div className="card card--course">
      <div className="card__media">
        <img src={image} alt={title} className="card__image" />
        <button
          type="button"
          onClick={handleBookmark}
          className="card__favorite"
          aria-pressed={favorite}
          aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          {favorite ? '❤️' : '🤍'}
        </button>
      </div>
      {href ? (
        <>
          <Link href={href} className="block">
            {content}
          </Link>
          {actions}
        </>
      ) : (
        <>
          {content}
          {actions}
        </>
      )}
    </div>
  )
}
