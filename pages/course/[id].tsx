import Header from '../../components/Header'
import { useRouter } from 'next/router'
import { useState } from 'react'

type CurriculumItem = {
  title: string
  sections: number
}

type Course = {
  title: string
  category: string
  description: string
  fullDescription: string
  image: string
  previewImage: string
  instructor: string
  instructorImage: string
  rating: number
  reviews: number
  students: number
  duration: string
  level: string
  includes: string[]
  curriculum: CurriculumItem[]
}

const courseDetails: Record<string, Course> = {
  '1': {
    title: 'Основы UI дизайна',
    category: 'ДИЗАЙН',
    description: 'Освойте принципы дизайна интерфейсов, теорию цвета и типографику.',
    fullDescription: 'Этот комплексный курс охватывает все от вайфреймов до высокодетализированных прототипов. Научитесь создавать визуально привлекательные функциональные интерфейсы, которые нравятся пользователям.',
    image: '/assets/hero.jpg',
    previewImage: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1600&q=80',
    instructor: 'Анна Петрова',
    instructorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100',
    rating: 4.8,
    reviews: 1240,
    students: 12000,
    duration: '4ч 20м',
    level: 'Начальный',
    includes: [
      '4.5 часа видео по запросу',
      '3 загружаемых ресурса',
      'Полный пожизненный доступ',
      'Сертификат о прохождении'
    ],
    curriculum: [
      { title: 'Введение в UI дизайн', sections: 3 },
      { title: 'Цвет и типография', sections: 4 },
      { title: 'Компоненты интерфейса', sections: 5 },
      { title: 'Итоговый проект', sections: 2 }
    ]
  }
}

export default function CoursePage(): JSX.Element {
  const router = useRouter()
  const [favorite, setFavorite] = useState(false)
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id
  const course = id ? courseDetails[id] ?? courseDetails['1'] : courseDetails['1']

  return (
    <>
      <Header />
      <main className="page-layout--white">
        <section className="hero-banner">
          <div className="hero-overlay"></div>
          <img src={course.image} alt={course.title} className="card__image card__media--hero" />

          <div className="hero-content">
            <div className="page-container w-full">
              <div className="hero-grid">
                <div className="hero-summary">
                  <span className="course-category">{course.category}</span>
                  <h1 className="section-title section-title--lg mt-2 mb-4 text-white">{course.title}</h1>
                  <p className="hero-description">{course.description}</p>
                  <div className="course-meta">
                    <span className="course-meta__item">⭐ {course.rating} ({course.reviews} отзывов)</span>
                    <span className="course-meta__item">🧑‍🎓 {(course.students / 1000).toFixed(0)}k студентов</span>
                    <button
                      type="button"
                      className={`course-meta__favorite ${favorite ? 'course-meta__favorite--active' : ''}`}
                      aria-pressed={favorite}
                      aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                      onClick={() => setFavorite((prev) => !prev)}
                    >
                      <span>{favorite ? '❤️' : '🤍'}</span>
                    </button>
                  </div>
                </div>

                <div className="hero-panel">
                  <div className="border-b border-gray-700 pb-6">
                    <img src={course.previewImage} alt={course.title} className="w-full h-40 object-cover rounded mb-4 course-panel-image" />
                    <button className="button button--primary button--full">
                      Записаться
                    </button>
                  </div>
                  <div className="text-white space-y-3 text-sm">
                    <h3 className="font-semibold mb-3">Этот курс включает:</h3>
                    {course.includes.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-container section">
          <div className="course-layout">
            <div className="course-main">
              <div className="course-section mb-12 pb-12">
                <h2 className="section-title text-2xl mb-6">О преподавателе</h2>
                <div className="flex items-center gap-4">
                  <img src={course.instructorImage} alt={course.instructor} className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.instructor}</h3>
                    <p className="text-gray-600">Продуктовый дизайнер из Сан-Франциско. Научу React и Next.js.</p>
                  </div>
                </div>
              </div>

              <div className="settings-section mb-12 pb-12">
                <h2 className="section-title text-2xl mb-4">О курсе</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{course.fullDescription}</p>
              </div>

              <div>
                <h2 className="section-title text-2xl mb-6">Содержание курса</h2>
                <div className="space-y-3">
                  {course.curriculum.map((section) => (
                    <div key={section.title} className="card card--course p-4 rounded-lg">
                      <button className="w-full flex items-center justify-between text-left">
                        <div>
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600">{section.sections} уроков</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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

                <button className="button button--primary button--full mt-6">
                  Записаться на курс
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  )
}
