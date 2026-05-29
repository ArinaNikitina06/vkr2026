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
  const visibleTags = tags.filter((tag) => (
    tag.toLowerCase() !== level?.toLowerCase() &&
    tag.toLowerCase() !== category.toLowerCase()
  ))

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

  const courseTitle = href ? (
    <Link href={href} className="card__title-link">
      <h3 className="card__title line-clamp-2">{title}</h3>
    </Link>
  ) : (
    <h3 className="card__title line-clamp-2">{title}</h3>
  )

  const content = (
    <div className="card__content">
      <div className="card__header">
        <Link href={`/catalog?category=${encodeURIComponent(category)}`} className="card__badge card__badge--link">
          {category}
        </Link>
      </div>

      {courseTitle}

      {description && variant === 'full' && (
        <p className="card__description line-clamp-2">{description}</p>
      )}

      {visibleTags.length > 0 && (
        <div className="form-tags mb-3">
          {visibleTags.map((tag) => (
            <Link key={tag} href={`/catalog?tag=${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      )}

      <div className="card__attributes">
        {level && (
          <Link href={`/catalog?level=${encodeURIComponent(level)}`}>
            {level}
          </Link>
        )}
        {rating && <span>Рейтинг {rating.toFixed(1)}</span>}
      </div>

      <RecommendationReason reasons={reasons} />

      <div className="card__bottom">
        {price && <div className="card__price">{price}</div>}
        <div className="card__footer">
          {duration && <span>⏱ {duration}</span>}
          {students && <span>🧑‍🎓 +{(students / 1000).toFixed(1)}k</span>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="card card--course">
      <div className="card__media">
        {href ? (
          <Link href={href} aria-label={`Открыть курс ${title}`}>
            <img src={image} alt={title} className="card__image" />
          </Link>
        ) : (
          <img src={image} alt={title} className="card__image" />
        )}
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
          {content}
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
