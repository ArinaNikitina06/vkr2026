import Link from 'next/link'
import Image from 'next/image'
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
  disableMetaLinks?: boolean
}

export default function CourseCard({
  id = '1',
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
    setLiked((value) => !value)
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
          aria-label={`${liked ? 'Убрать отметку нравится' : 'Отметить как понравившийся'}: ${title}`}
          onClick={handleLike}
        >
          Нравится
        </button>
      )}
      {onHide && (
        <button
          type="button"
          className="card__action"
          aria-label={`Скрыть курс ${title} из рекомендаций`}
          onClick={() => onHide(id)}
        >
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
        {categoryElement}
      </div>

      {courseTitle}

      {description && variant === 'full' && (
        <p className="card__description line-clamp-2">{description}</p>
      )}

      {visibleTags.length > 0 && (
        <div className="form-tags mb-3">
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
