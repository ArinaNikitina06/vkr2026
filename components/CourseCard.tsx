import Link from 'next/link'
import { useState } from 'react'

type CourseCardProps = {
  id?: string
  image?: string
  category?: string
  title: string
  description?: string
  tags?: string[]
  duration?: string
  students?: number
  variant?: 'compact' | 'full'
  href?: string
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
  variant = 'full',
  href
}: CourseCardProps): JSX.Element {
  const [favorite, setFavorite] = useState(false)

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
          onClick={() => setFavorite((value) => !value)}
          className="card__favorite"
          aria-label="Добавить в избранное"
        >
          {favorite ? '❤️' : '🤍'}
        </button>
      </div>
      {href ? (
        <Link href={href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}
