import Image from 'next/image'
import Link from 'next/link'
import type { LearningCourse } from '../lib/types'

type LearningCourseListProps = {
  courses: LearningCourse[]
}

export default function LearningCourseList({ courses }: LearningCourseListProps): JSX.Element {
  return (
    <div className="course-row">
      {courses.map((course) => (
        <article key={course.id} className="course-card-row">
          <div className="course-card-row__media">
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes="(min-width: 768px) 12rem, 100vw"
              className="card__image"
              unoptimized={course.image.endsWith('.svg')}
            />
          </div>
          <div className="course-card-row__body">
            <div>
              <span className="card__badge">{course.category}</span>
              <h3 className="card__title course-card-row__title">{course.title}</h3>
              <p className="card__description">{course.description}</p>
            </div>
            <div className="course-progress">
              <div className="course-progress__header">
                <span className="course-progress__label">Прогресс</span>
                <span className="course-progress__value">{course.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          </div>
          <div className="course-card-row__actions">
            <Link href={`/course/${course.id}`} className="button button--primary">
              Продолжить
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
