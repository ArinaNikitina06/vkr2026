import Header from '../components/Header'
import CourseGrid from '../components/CourseGrid'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LearningCourseList from '../components/LearningCourseList'
import RecommendationSection from '../components/RecommendationSection'
import RecommendationCourseGrid from '../components/RecommendationCourseGrid'
import SkeletonCard from '../components/SkeletonCard'
import Toast from '../components/ui/Toast'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useStringListStorage } from '../hooks/useStringListStorage'
import { courses, ongoingCourses } from '../lib/data/courses'
import {
  defaultPreferences,
  hiddenCoursesStorageKey,
  likedCoursesStorageKey,
  preferencesStorageKey
} from '../lib/data/preferences'
import type { RecommendationItem, UserPreferences } from '../lib/types'

type RecommendationsResponse = {
  sections: {
    title: string
    items: RecommendationItem[]
  }[]
}

export default function Home(): JSX.Element {
  const { data: session, status } = useSession()
  const hiddenCourseStorage = useStringListStorage(hiddenCoursesStorageKey)
  const likedCourseStorage = useStringListStorage(likedCoursesStorageKey)
  const isAuthenticated = status === 'authenticated'
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [hiddenCourseIds, setHiddenCourseIds] = useState<string[]>([])
  const [personalRecommendations, setPersonalRecommendations] = useState<RecommendationItem[]>([])
  const [interestRecommendations, setInterestRecommendations] = useState<RecommendationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [recommendationsError, setRecommendationsError] = useState(false)
  const [toast, setToast] = useState<string>('')
  const userName = session?.user?.name ?? session?.user?.email
  const greeting = isAuthenticated && userName
    ? `Добрый день, ${userName}`
    : 'Добрый день'

  const loadRecommendations = useCallback(async (nextPreferences: UserPreferences, nextHiddenCourseIds: string[]) => {
    setIsLoading(true)
    setRecommendationsError(false)

    try {
      const params = new URLSearchParams({
        goal: nextPreferences.goal,
        level: nextPreferences.level,
        interests: nextPreferences.interests.join(','),
        hidden: nextHiddenCourseIds.join(','),
        liked: likedCourseStorage.read().join(',')
      })

      const response = await fetch(`/api/recommendations?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Recommendations request failed')
      }

      const data = await response.json() as RecommendationsResponse

      setPersonalRecommendations(data.sections.find((section) => section.title === 'Для вас')?.items ?? [])
      setInterestRecommendations(data.sections.find((section) => section.title === 'На основе ваших интересов')?.items ?? [])
    } catch {
      setRecommendationsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [likedCourseStorage])

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    const savedPreferences = window.localStorage.getItem(preferencesStorageKey)
    const nextPreferences = savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences
    const nextHiddenCourseIds = hiddenCourseStorage.read()

    setPreferences(nextPreferences)
    setHiddenCourseIds(nextHiddenCourseIds)
    loadRecommendations(nextPreferences, nextHiddenCourseIds)
  }, [hiddenCourseStorage, isAuthenticated, loadRecommendations, status])

  const sendInteraction = async (courseId: string, type: 'like' | 'hide') => {
    await fetch('/api/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId, type })
    })
  }

  const handleHide = (courseId: string) => {
    const nextHiddenIds = Array.from(new Set([...hiddenCourseIds, courseId]))
    setHiddenCourseIds(nextHiddenIds)
    hiddenCourseStorage.save(nextHiddenIds)
    sendInteraction(courseId, 'hide')
    loadRecommendations(preferences, nextHiddenIds)
    setToast('Курс скрыт из рекомендаций')
  }

  const handleLike = (courseId: string) => {
    const nextLikedIds = Array.from(new Set([...likedCourseStorage.read(), courseId]))
    likedCourseStorage.save(nextLikedIds)
    sendInteraction(courseId, 'like')
    loadRecommendations(preferences, hiddenCourseIds)
    setToast('Отметка учтена для будущих рекомендаций')
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="page-layout">
          <section className="page-container section section--compact">
            <div className="section__header">
              <h1 className="section-title">{greeting}</h1>
            </div>
            <p className="section-subtitle">Выберите курс из каталога. Для просмотра деталей и персональных рекомендаций нужно войти в систему.</p>
          </section>

          <section className="page-container section">
            <div className="section-heading">
              <h2 className="section-title">Все курсы</h2>
              <Link href="/signin" className="link link--small">
                Войти для персонализации
              </Link>
            </div>

            <CourseGrid
              courses={courses}
              getHref={(course) => `/signin?callbackUrl=${encodeURIComponent(`/course/${course.id}`)}`}
              disableMetaLinks
            />
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="page-layout">
        <section className="page-container section section--compact">
          <div className="section__header">
            <h1 className="section-title">{greeting}</h1>
          </div>
          <p className="section-subtitle">Готовы продолжить обучение сегодня?</p>
          {!preferences.onboarded && (
            <div className="section__action">
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
          <div className="home-learning-layout">
            <div className="home-learning-layout__header">
              <div className="section-heading">
                <h2 className="section-title">Продолжить обучение</h2>
                <Link href="/my-learning" className="link link--small">
                  Смотреть все
                </Link>
              </div>
            </div>

            <div className="home-learning">
              <LearningCourseList courses={ongoingCourses} />
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
          ) : recommendationsError ? (
            <ErrorState
              description="Не получилось получить персональную ленту."
              action={(
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => loadRecommendations(preferences, hiddenCourseIds)}
                >
                  Повторить
                </button>
              )}
            />
          ) : personalRecommendations.length > 0 ? (
            <RecommendationCourseGrid items={personalRecommendations} onLike={handleLike} onHide={handleHide} />
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
          ) : recommendationsError ? (
            <ErrorState
              description="Не получилось получить курсы по интересам."
              action={(
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => loadRecommendations(preferences, hiddenCourseIds)}
                >
                  Повторить
                </button>
              )}
            />
          ) : (
            <RecommendationCourseGrid items={interestRecommendations} onLike={handleLike} onHide={handleHide} />
          )}
        </RecommendationSection>
      </main>
    </>
  )
}
