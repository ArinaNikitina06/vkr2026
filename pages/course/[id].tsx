import Header from '../../components/Header'
import CourseCurriculum from '../../components/CourseCurriculum'
import CourseIncludes from '../../components/CourseIncludes'
import CourseInstructor from '../../components/CourseInstructor'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import RecommendationSection from '../../components/RecommendationSection'
import RecommendationCourseGrid from '../../components/RecommendationCourseGrid'
import SkeletonCard from '../../components/SkeletonCard'
import Toast from '../../components/ui/Toast'
import { useEffect, useState } from 'react'
import { useRouteParam } from '../../hooks/useRouteParam'
import { getCourseById } from '../../lib/data/courses'
import type { RecommendationItem } from '../../lib/types'

type RecommendationsResponse = {
  sections: {
    title: string
    items: RecommendationItem[]
  }[]
}

export default function CoursePage(): JSX.Element {
  const courseId = useRouteParam('id')
  const [enrolled, setEnrolled] = useState(false)
  const [error, setError] = useState('')
  const [similarCoursesError, setSimilarCoursesError] = useState(false)
  const [isSimilarCoursesLoading, setIsSimilarCoursesLoading] = useState(true)
  const course = courseId ? getCourseById(courseId) : undefined
  const [similarCourses, setSimilarCourses] = useState<RecommendationItem[]>([])

  const includes = course?.includes ?? []
  const curriculum = course?.curriculum ?? []
  const instructorImage = course?.instructorImage

  useEffect(() => {
    if (!courseId || !course) {
      return
    }

    setIsSimilarCoursesLoading(true)
    setSimilarCoursesError(false)

    fetch(`/api/recommendations?context=course&courseId=${encodeURIComponent(courseId)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Similar courses request failed')
        }

        return response.json()
      })
      .then((data: RecommendationsResponse) => {
        setSimilarCourses(data.sections[0]?.items ?? [])
      })
      .catch(() => setSimilarCoursesError(true))
      .finally(() => setIsSimilarCoursesLoading(false))

    fetch('/api/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId, type: 'view' })
    })
  }, [course, courseId])

  if (!courseId) {
    return (
      <>
        <Header />
        <main className="page-layout">
          <section className="page-container section">
            <SkeletonCard count={1} />
          </section>
        </main>
      </>
    )
  }

  if (!course) {
    return (
      <>
        <Header />
        <main className="page-layout">
          <section className="page-container section">
            <EmptyState
              title="Курс не найден"
              description="Вернитесь в каталог и выберите другой курс."
            />
          </section>
        </main>
      </>
    )
  }

  const enrollCourse = async () => {
    setError('')

    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId: course.id })
      })

      if (!response.ok) {
        throw new Error('Enroll request failed')
      }
    } catch {
      setError('Не удалось записаться на курс. Попробуйте ещё раз.')
      return
    }

    setEnrolled(true)
  }

  return (
    <>
      <Header />
      <main className="page-layout--white">
        <section className="hero-banner">
          <div className="page-container page-container--full">
            <div className="hero-grid">
              <div className="hero-summary">
                <span className="course-category">{course.category}</span>
                <h1 className="course-hero-title">{course.title}</h1>
                <p className="hero-description">{course.description}</p>
                <div className="course-meta">
                  <span className="course-meta__item">Рейтинг {course.rating} ({course.reviews} отзывов)</span>
                  <span className="course-meta__item">{(course.students / 1000).toFixed(0)}k студентов</span>
                  <span className="course-meta__item">{course.duration}</span>
                </div>
              </div>

              <div className="hero-panel">
                <div className="hero-panel__preview">
                  <div className="course-panel-summary">
                    <span className="course-panel-summary__label">Формат</span>
                    <strong className="course-panel-summary__value">Онлайн-курс</strong>
                    <span className="course-panel-summary__label">Стоимость</span>
                    <strong className="course-panel-summary__value">{course.price ?? 'Бесплатно'}</strong>
                  </div>
                  <button
                    className="button button--primary button--full"
                    type="button"
                    onClick={enrollCourse}
                  >
                    {enrolled ? 'Вы записаны' : 'Записаться'}
                  </button>
                </div>
                <CourseIncludes items={includes} />
              </div>
            </div>
          </div>
        </section>

        <section className="page-container section">
          <div className="course-layout">
            <div className="course-main">
              <CourseInstructor name={course.instructor} image={instructorImage} />

              <section className="course-section">
                <h2 className="course-section__title">О курсе</h2>
                <p className="course-section__text">{course.fullDescription ?? course.description}</p>
              </section>

              <CourseCurriculum sections={curriculum} />
            </div>

            <aside className="course-sidebar">
              <div className="info-box">
                <h3 className="info-box__title">Информация о курсе</h3>
                <div className="info-box__item">
                  <div>
                    <span className="info-box__label">Уровень</span>
                    <p className="info-box__value">{course.level}</p>
                  </div>
                  <div>
                    <span className="info-box__label">Длительность</span>
                    <p className="info-box__value">{course.duration}</p>
                  </div>
                  <div>
                    <span className="info-box__label">Студентов</span>
                    <p className="info-box__value">{(course.students / 1000).toFixed(0)}k+</p>
                  </div>
                </div>

                <button
                  className="button button--primary button--full info-box__button"
                  type="button"
                  onClick={enrollCourse}
                >
                  {enrolled ? 'Курс добавлен' : 'Записаться на курс'}
                </button>
              </div>
            </aside>
          </div>
        </section>

        {enrolled && (
          <section className="page-container section--compact">
            <Toast tone="success">Запись на курс сохранена в прототипе</Toast>
          </section>
        )}

        {error && (
          <section className="page-container section--compact">
            <Toast tone="error">{error}</Toast>
          </section>
        )}

        <RecommendationSection
          title="Похожие курсы"
          description="Подборка учитывает направление, уровень и общие темы курса."
        >
          {isSimilarCoursesLoading ? (
            <SkeletonCard count={4} />
          ) : similarCoursesError ? (
            <ErrorState description="Не получилось загрузить похожие курсы." />
          ) : similarCourses.length > 0 ? (
            <RecommendationCourseGrid items={similarCourses} />
          ) : (
            <EmptyState
              title="Похожие курсы не найдены"
              description="Можно вернуться в каталог и выбрать другое направление."
            />
          )}
        </RecommendationSection>
      </main>
    </>
  )
}
