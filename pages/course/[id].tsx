import Header from '../../components/Header'
import Button from '../../components/ui/Button'
import CourseCurriculum from '../../components/CourseCurriculum'
import CourseIncludes from '../../components/CourseIncludes'
import CourseInstructor from '../../components/CourseInstructor'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import RecommendationSection from '../../components/RecommendationSection'
import RecommendationCourseGrid from '../../components/RecommendationCourseGrid'
import SkeletonCard from '../../components/SkeletonCard'
import type { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { sendCourseInteraction } from '../../lib/recommendations/client'
import { getCourseByIdFromDatabase } from '../../lib/server/courseRepository'
import type { Course, RecommendationItem } from '../../lib/types'

type RecommendationsResponse = {
  sections: {
    title: string
    items: RecommendationItem[]
  }[]
}

type CoursePageProps = {
  course: Course | null
}

export const getServerSideProps: GetServerSideProps<CoursePageProps> = async (context) => {
  const courseId = typeof context.params?.id === 'string' ? context.params.id : ''
  const course = courseId ? await getCourseByIdFromDatabase(courseId) : null

  return {
    props: {
      course
    }
  }
}

export default function CoursePage({ course }: CoursePageProps): JSX.Element {
  const [enrolled, setEnrolled] = useState(false)
  const [error, setError] = useState('')
  const [similarCoursesError, setSimilarCoursesError] = useState(false)
  const [isSimilarCoursesLoading, setIsSimilarCoursesLoading] = useState(true)
  const [similarCourses, setSimilarCourses] = useState<RecommendationItem[]>([])

  const includes = course?.includes ?? []
  const curriculum = course?.curriculum ?? []
  const courseImage = course?.previewImage ?? course?.image ?? '/assets/course-design.svg'
  const instructorImage = course?.instructorImage

  useEffect(() => {
    if (!course) {
      return
    }

    setIsSimilarCoursesLoading(true)
    setSimilarCoursesError(false)

    fetch(`/api/recommendations?context=course&courseId=${encodeURIComponent(course.id)}`)
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

    void sendCourseInteraction(course.id, 'view').catch(() => undefined)
  }, [course])

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
    toast.success('Запись на курс сохранена в прототипе')
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
                <div className="hero-panel__image">
                  <Image
                    src={courseImage}
                    alt={course.title}
                    fill
                    sizes="24rem"
                    className="hero-panel__image-content"
                    unoptimized={courseImage.endsWith('.svg')}
                  />
                </div>
                <div className="hero-panel__preview">
                  <div className="course-panel-summary">
                    <span className="course-panel-summary__label">Уровень</span>
                    <strong className="course-panel-summary__value">{course.level}</strong>
                    <span className="course-panel-summary__label">Длительность</span>
                    <strong className="course-panel-summary__value">{course.duration}</strong>
                    <span className="course-panel-summary__label">Формат</span>
                    <strong className="course-panel-summary__value">Онлайн-курс</strong>
                    <span className="course-panel-summary__label">Стоимость</span>
                    <strong className="course-panel-summary__value">{course.price ?? 'Бесплатно'}</strong>
                  </div>
                  <Button fullWidth onClick={enrollCourse}>
                    {enrolled ? 'Вы записаны' : 'Записаться'}
                  </Button>
                </div>
                <CourseIncludes items={includes} />
              </div>
            </div>
          </div>
        </section>

        <section className="page-container section">
          <div className="course-content">
            <div className="course-main">
              <CourseInstructor
                name={course.instructor}
                image={instructorImage}
                description={course.instructorDescription}
              />

              <section className="course-section">
                <h2 className="course-section__title">О курсе</h2>
                <p className="course-section__text">{course.fullDescription ?? course.description}</p>
              </section>

              <CourseCurriculum sections={curriculum} />
            </div>
          </div>
        </section>

        {error && (
          <section className="page-container section--compact">
            <p className="ui-toast ui-toast--error" role="alert">{error}</p>
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
