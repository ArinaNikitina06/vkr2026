import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import Link from 'next/link'

type Course = {
  id: string
  image: string
  category: string
  title: string
  description: string
  tags: string[]
  duration: string
  students: number
  progress?: number
}

const recommendedCourses: Course[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    category: 'ДИЗАЙН',
    title: 'Основы UI дизайна',
    description: 'Освойте принципы дизайна интерфейсов, теорию цвета и типографику.',
    tags: ['Дизайн', 'Начальный'],
    duration: '4ч 20м',
    students: 1200
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
    category: 'РАЗРАБОТКА',
    title: 'Fullstack Next.js 14',
    description: 'Создавайте масштабируемые приложения с новейшими возможностями Next.js.',
    tags: ['Разработка', 'Продвинутый'],
    duration: '8ч 15м',
    students: 2300
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
    category: 'БИЗНЕС',
    title: 'Продакт-менеджмент',
    description: 'Научитесь управлять продуктовыми командами и определять стратегию.',
    tags: ['Бизнес', 'Средний'],
    duration: '6ч 00м',
    students: 1500
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
    category: 'ДАННЫЕ',
    title: 'Data Science с Python',
    description: 'Анализируйте данные и создавайте визуализации с помощью Pandas.',
    tags: ['Данные', 'Начальный'],
    duration: '12ч 45м',
    students: 2100
  }
]

const ongoingCourses: Course[] = [
  {
    id: 'ongoing-1',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
    category: 'РАЗРАБОТКА',
    title: 'Продвинутые паттерны React',
    description: 'Паттерны и лучшие практики для профессиональной разработки.',
    tags: ['Разработка', 'Продвинутый'],
    duration: '4ч 20м',
    students: 0,
    progress: 65
  }
]

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
