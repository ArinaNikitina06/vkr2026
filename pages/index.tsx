import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import Link from 'next/link'
import { ongoingCourses, recommendedCourses } from '../lib/data/courses'

export default function Home(): JSX.Element {
  return (
    <>
      <Header />
      <main className="page-layout">
        <section className="page-container section section--compact">
          <div className="section__header">
            <h1 className="section-title">Доброе утро, Арина</h1>
          </div>
          <p className="section-subtitle">Готовы продолжить обучение сегодня?</p>
        </section>

        <section className="page-container section">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-4">
              <div className="section-heading">
                <h2 className="section-title">Продолжить обучение</h2>
                <Link href="/my-learning" className="link link--small">
                  Смотреть все
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-4">
                {ongoingCourses.map((course) => (
                  <div key={course.id} className="card card--course w-full">
                <div className="card__media card__media--compact">
                  <img src={course.image} alt={course.title} className="card__image" />
                </div>
                <div className="card__body">
                  <div className="card__header">
                    <span className="card__badge">{course.category}</span>
                  </div>
                  <h3 className="card__title">{course.title}</h3>
                  <p className="card__description">{course.description}</p>

                  {course.progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Прогресс</span>
                        <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-800 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <button className="button button--secondary button--full">
                    Продолжить курс
                  </button>
                </div>
              </div>
            ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-container section">
          <div className="section-heading">
            <h2 className="section-title">Рекомендовано для вас</h2>
            <Link href="/catalog" className="link link--small">
              Смотреть все
            </Link>
          </div>

          <div className="grid-cards">
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} href={`/course/${course.id}`} {...course} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
