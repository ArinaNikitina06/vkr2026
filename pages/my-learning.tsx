import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import Link from 'next/link'
import { useState } from 'react'

type LearningTabs = 'inProgress' | 'saved' | 'completed'

type LearningCourse = {
  id: string
  image: string
  category: string
  title: string
  description: string
  tags: string[]
  duration: string
  progress?: number
}

type LearningTabData = Record<LearningTabs, LearningCourse[]>

const myLearningCourses: LearningTabData = {
  inProgress: [
    {
      id: 'ongoing-1',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
      category: 'РАЗРАБОТКА',
      title: 'Продвинутые паттерны React',
      description: 'Паттерны и лучшие практики для профессиональной разработки.',
      tags: ['Разработка', 'Продвинутый'],
      duration: '4ч 20м',
      progress: 65
    },
    {
      id: 'ongoing-2',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
      category: 'ДИЗАЙН',
      title: 'Дизайн-системы 101',
      description: 'Как создавать и поддерживать масштабируемые дизайн-системы.',
      tags: ['Дизайн', 'Средний'],
      duration: '4ч 20м',
      progress: 12
    },
    {
      id: 'ongoing-3',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
      category: 'БИЗНЕС',
      title: 'Продакт-менеджмент',
      description: 'Научитесь управлять продуктовыми командами.',
      tags: ['Бизнес', 'Средний'],
      duration: '6ч 00м',
      progress: 38
    }
  ],
  saved: [
    {
      id: 'saved-1',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
      category: 'ДИЗАЙН',
      title: 'Основы UI дизайна',
      description: 'Освойте принципы дизайна интерфейсов.',
      tags: ['Дизайн', 'Начальный'],
      duration: '4ч 20м'
    },
    {
      id: 'saved-2',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
      category: 'РАЗРАБОТКА',
      title: 'Fullstack Next.js 14',
      description: 'Создавайте масштабируемые приложения.',
      tags: ['Разработка', 'Продвинутый'],
      duration: '8ч 15м'
    }
  ],
  completed: [
    {
      id: 'completed-1',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200',
      category: 'БИЗНЕС',
      title: 'JavaScript для начинающих',
      description: 'Основы программирования на JavaScript.',
      tags: ['Разработка', 'Начальный'],
      duration: '10ч 30м'
    }
  ]
}

export default function MyLearning(): JSX.Element {
  const [activeTab, setActiveTab] = useState<LearningTabs>('inProgress')

  const tabData: LearningTabData = {
    inProgress: myLearningCourses.inProgress,
    saved: myLearningCourses.saved,
    completed: myLearningCourses.completed
  }

  return (
    <>
      <Header />
      <main className="page-layout">
        <section className="page-container section section--compact">
          <h1 className="section-title section-title--lg mb-2">Мое обучение</h1>
          <p className="section-subtitle">Отслеживайте свой прогресс и продолжайте обучение.</p>
        </section>

        <section className="page-container section">
          <div className="tabs">
            {([
              { id: 'inProgress', label: 'В процессе' },
              { id: 'saved', label: 'Сохраненные' },
              { id: 'completed', label: 'Завершенные' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item ${
                  activeTab === tab.id ? 'tab-item--active' : 'tab-item--inactive'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="page-container section">
          {activeTab === 'inProgress' ? (
            <div className="course-row">
              {tabData.inProgress.map((course) => (
                <div key={course.id} className="course-card-row">
                  <div className="course-card-row__media">
                    <img src={course.image} alt={course.title} className="card__image" />
                  </div>
                  <div className="course-card-row__body">
                    <div>
                      <span className="card__badge">{course.category}</span>
                      <h3 className="card__title mt-2">{course.title}</h3>
                      <p className="card__description">{course.description}</p>
                    </div>
                    <div className="course-progress">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Прогресс</span>
                        <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar__fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="course-card-row__actions">
                    <Link href={`/course/${course.id}`}>
                      <button className="button button--primary">
                        Продолжить
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tabData[activeTab].map((course) => (
                <CourseCard key={course.id} href={`/course/${course.id}`} {...course} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
