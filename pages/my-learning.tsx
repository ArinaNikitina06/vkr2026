import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import Link from 'next/link'
import { useState } from 'react'
import { myLearningCourses } from '../lib/data/courses'

type LearningTabs = 'inProgress' | 'saved' | 'completed'

export default function MyLearning(): JSX.Element {
  const [activeTab, setActiveTab] = useState<LearningTabs>('inProgress')

  const tabData = {
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
