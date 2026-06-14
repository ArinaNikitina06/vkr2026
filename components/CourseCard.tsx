import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import RecommendationReason from './RecommendationReason'

type CourseCardProps = {
  id: string
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
  disableMetaLinks?: boolean
}

export default function CourseCard({
  id,
  image = '/assets/course-design.svg',
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
  disableMetaLinks = false
}: CourseCardProps): JSX.Element {
  const [liked, setLiked] = useState(false)
  const isSvgImage = image.endsWith('.svg')
  const visibleTags = tags.filter((tag) => (
    tag.toLowerCase() !== level?.toLowerCase() &&
    tag.toLowerCase() !== category.toLowerCase()
  ))

  const handleLike = () => {
    if (liked) {
      return
    }

    setLiked(true)
    onLike?.(id)
  }

  const categoryElement = disableMetaLinks ? (
    <span className="card__badge">{category}</span>
  ) : (
    <Link href={`/catalog?category=${encodeURIComponent(category)}`} className="card__badge card__badge--link">
      {category}
    </Link>
  )

  const actions = (onLike || onHide) ? (
    <div className="card__actions">
      {onLike && (
        <button
          type="button"
          className={`card__action ${liked ? 'card__action--active' : ''}`}
          aria-pressed={liked}
          aria-label={`${liked ? 'Курс уже отмечен как понравившийся' : 'Отметить как понравившийся'}: ${title}`}
          onClick={handleLike}
        >
          <span className="card__action-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" focusable="false">
              <path d="M10 17.2 8.9 16.1C4.7 12.4 2 10 2 7.1 2 4.8 3.8 3 6.1 3c1.3 0 2.6.6 3.4 1.6C10.3 3.6 11.6 3 12.9 3 15.2 3 17 4.8 17 7.1c0 2.9-2.7 5.3-6.9 9L10 17.2Z" />
            </svg>
          </span>
          <span>Нравится</span>
        </button>
      )}
      {onHide && (
        <button
          type="button"
          className="card__action"
          aria-label={`Скрыть курс ${title} из рекомендаций`}
          onClick={() => onHide(id)}
        >
          <span className="card__action-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" focusable="false">
              <path d="M3.2 3.2a.8.8 0 0 1 1.1 0l12.5 12.5a.8.8 0 0 1-1.1 1.1l-2.2-2.2A8.6 8.6 0 0 1 10 15.4c-4.3 0-7.1-3.4-8.1-5a1.4 1.4 0 0 1 0-1.5 13 13 0 0 1 3-3.2L3.2 4.3a.8.8 0 0 1 0-1.1Zm4 4L5.9 5.9A11 11 0 0 0 3.3 9.7c.9 1.3 3.2 4.1 6.7 4.1.8 0 1.6-.2 2.3-.5l-1.4-1.4a2.5 2.5 0 0 1-3.7-3.7Zm2.1 2.1a.9.9 0 0 0 1.4 1.4L9.3 9.3Zm.7-4.7c4.3 0 7.1 3.4 8.1 5a1.4 1.4 0 0 1 0 1.5 11.5 11.5 0 0 1-1.9 2.4l-1.1-1.1a10.2 10.2 0 0 0 1.6-2.1C15.8 9 13.5 6.2 10 6.2c-.5 0-1 .1-1.5.2L7.2 5.1c.9-.3 1.8-.5 2.8-.5Z" />
            </svg>
          </span>
          <span>Скрыть</span>
        </button>
      )}
    </div>
  ) : null

  const courseTitle = href ? (
    <Link href={href} className="card__title-link">
      <h3 className="card__title card__title--clamped">{title}</h3>
    </Link>
  ) : (
    <h3 className="card__title card__title--clamped">{title}</h3>
  )

  const content = (
    <div className="card__content">
      <div className="card__header">
        {categoryElement}
      </div>

      {courseTitle}

      {description && variant === 'full' && (
        <p className="card__description card__description--clamped">{description}</p>
      )}

      {visibleTags.length > 0 && (
        <div className="form-tags form-tags--card">
          {visibleTags.map((tag) => (
            disableMetaLinks ? (
              <span key={tag} className="tag">{tag}</span>
            ) : (
              <Link key={tag} href={`/catalog?tag=${encodeURIComponent(tag)}`} className="tag">
                {tag}
              </Link>
            )
          ))}
        </div>
      )}

      <div className="card__attributes">
        {level && (
          disableMetaLinks ? (
            <span>{level}</span>
          ) : (
            <Link href={`/catalog?level=${encodeURIComponent(level)}`}>
              {level}
            </Link>
          )
        )}
        {rating && <span>Рейтинг {rating.toFixed(1)}</span>}
      </div>

      <RecommendationReason reasons={reasons} />

      <div className="card__bottom">
        <div className="card__meta">
          {duration && <span>⏱ {duration}</span>}
          {students && <span>🧑‍🎓 +{(students / 1000).toFixed(1)}k</span>}
        </div>

        {price && <div className="card__price">{price}</div>}

        {actions}
      </div>
    </div>
  )

  return (
    <div className="card card--course">
      <div className="card__media">
        {href ? (
          <Link href={href} className="card__media-link" aria-label={`Открыть курс ${title}`}>
            <Image src={image} alt={title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="card__image" unoptimized={isSvgImage} />
          </Link>
        ) : (
          <Image src={image} alt={title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="card__image" unoptimized={isSvgImage} />
        )}
      </div>
      {content}
    </div>
  )
}
