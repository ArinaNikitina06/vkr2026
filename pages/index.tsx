import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import EmptyState from '../components/EmptyState'
import RecommendationSection from '../components/RecommendationSection'
import SkeletonCard from '../components/SkeletonCard'
import Toast from '../components/ui/Toast'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { courses, ongoingCourses } from '../lib/data/courses'
import {
  bookmarkedCoursesStorageKey,
  defaultPreferences,
  hiddenCoursesStorageKey,
  likedCoursesStorageKey,
  preferencesStorageKey
} from '../lib/data/preferences'
import { rankCourses } from '../lib/recommendations/rank'
import type { UserPreferences } from '../lib/types'

function readStringList(key: string): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

function saveStringList(key: string, value: string[]) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export default function Home(): JSX.Element {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [hiddenCourseIds, setHiddenCourseIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<string>('')

  useEffect(() => {
    const savedPreferences = window.localStorage.getItem(preferencesStorageKey)

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }

    setHiddenCourseIds(readStringList(hiddenCoursesStorageKey))
    setIsLoading(false)
  }, [])

  const recommendations = useMemo(() => (
    rankCourses(courses, preferences, hiddenCourseIds)
  ), [hiddenCourseIds, preferences])

  const personalRecommendations = recommendations.slice(0, 4)
  const interestRecommendations = recommendations
    .filter((item) => item.course.tags.some((tag) => preferences.interests.includes(tag)))
    .slice(0, 4)

  const handleHide = (courseId: string) => {
    const nextHiddenIds = Array.from(new Set([...hiddenCourseIds, courseId]))
    setHiddenCourseIds(nextHiddenIds)
    saveStringList(hiddenCoursesStorageKey, nextHiddenIds)
    setToast('Курс скрыт из рекомендаций')
  }

  const handleLike = (courseId: string) => {
    const nextLikedIds = Array.from(new Set([...readStringList(likedCoursesStorageKey), courseId]))
    saveStringList(likedCoursesStorageKey, nextLikedIds)
    setToast('Отметка учтена для будущих рекомендаций')
  }

  const handleBookmark = (courseId: string) => {
    const nextBookmarkedIds = Array.from(new Set([...readStringList(bookmarkedCoursesStorageKey), courseId]))
    saveStringList(bookmarkedCoursesStorageKey, nextBookmarkedIds)
    setToast('Курс добавлен в избранное')
  }

  return (
    <>
      <Header />
      <main className="page-layout">
        <section className="page-container section section--compact">
          <div className="section__header">
            <h1 className="section-title">Доброе утро, Арина</h1>
          </div>
          <p className="section-subtitle">Готовы продолжить обучение сегодня?</p>
          {!preferences.onboarded && (
            <div className="mt-4">
              <Link href="/settings" className="link link--small">
                Настроить цель и интересы для персональных рекомендаций
              </Link>
            </div>
          )}
        </section>

        {toast && (
          <section className="page-container section--compact">
            <Toast tone="success">{toast}</Toast>
          </section>
        )}

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

                      <button className="button button--secondary button--full" type="button">
                        Продолжить курс
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <RecommendationSection
          title="Для вас"
          description={`Подборка учитывает цель «${preferences.goal}», интересы и уровень подготовки.`}
          action={<Link href="/catalog" className="link link--small">Смотреть каталог</Link>}
        >
          {isLoading ? (
            <SkeletonCard count={4} />
          ) : personalRecommendations.length > 0 ? (
            <div className="grid-cards">
              {personalRecommendations.map((item) => (
                <CourseCard
                  key={item.course.id}
                  href={`/course/${item.course.id}`}
                  reasons={item.reasons}
                  onLike={handleLike}
                  onHide={handleHide}
                  onBookmark={handleBookmark}
                  {...item.course}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Все рекомендации скрыты"
              description="Можно изменить интересы в настройках или открыть полный каталог."
              action={<Link href="/settings" className="button button--secondary">Настроить интересы</Link>}
            />
          )}
        </RecommendationSection>

        <RecommendationSection
          title="На основе ваших интересов"
          description="Курсы, которые совпадают с выбранными темами профиля."
          action={<Link href="/settings" className="link link--small">Изменить интересы</Link>}
        >
          {isLoading ? (
            <SkeletonCard count={4} />
          ) : (
            <div className="grid-cards">
              {interestRecommendations.map((item) => (
                <CourseCard
                  key={item.course.id}
                  href={`/course/${item.course.id}`}
                  reasons={item.reasons}
                  onLike={handleLike}
                  onHide={handleHide}
                  onBookmark={handleBookmark}
                  {...item.course}
                />
              ))}
            </div>
          )}
        </RecommendationSection>
      </main>
    </>
  )
}
