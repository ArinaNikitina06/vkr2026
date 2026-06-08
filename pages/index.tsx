import Header from '../components/Header'
import CourseGrid from '../components/CourseGrid'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LearningCourseList from '../components/LearningCourseList'
import RecommendationSection from '../components/RecommendationSection'
import RecommendationCourseGrid from '../components/RecommendationCourseGrid'
import SkeletonCard from '../components/SkeletonCard'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PreferencesModal from '../components/PreferencesModal'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { courses, ongoingCourses } from '../lib/data/courses'
import {
  defaultPreferences,
  getUserPreferencesStorageKey,
  hiddenCoursesStorageKey,
  isPendingOnboardingForUser,
  likedCoursesStorageKey,
  pendingOnboardingStorageKey,
} from '../lib/data/preferences'
import {
  fetchHomeRecommendations,
  saveUserPreferences,
  sendCourseInteraction
} from '../lib/recommendations/client'
import { readLocalStorageText, removeLocalStorageValue } from '../lib/storage'
import { getUserDisplayName } from '../lib/userDisplay'
import type { RecommendationItem, UserPreferences } from '../lib/types'

const emptyCourseIds: string[] = []

export default function Home(): JSX.Element {
  const router = useRouter()
  const { data: session, status } = useSession()
  const hiddenCourseStorage = useLocalStorage<string[]>(hiddenCoursesStorageKey, emptyCourseIds)
  const likedCourseStorage = useLocalStorage<string[]>(likedCoursesStorageKey, emptyCourseIds)
  const isAuthenticated = status === 'authenticated'
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [hiddenCourseIds, setHiddenCourseIds] = useState<string[]>([])
  const [personalRecommendations, setPersonalRecommendations] = useState<RecommendationItem[]>([])
  const [interestRecommendations, setInterestRecommendations] = useState<RecommendationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [recommendationsError, setRecommendationsError] = useState(false)
  const [shouldShowOnboardingModal, setShouldShowOnboardingModal] = useState(false)
  const userName = isAuthenticated ? getUserDisplayName(session?.user?.name, session?.user?.email) : ''
  const userPreferencesStorageKey = getUserPreferencesStorageKey(session?.user?.email)
  const userPreferencesStorage = useLocalStorage<UserPreferences>(userPreferencesStorageKey, defaultPreferences)
  const greeting = isAuthenticated && userName
    ? `Добрый день, ${userName}`
    : 'Добрый день'

  const loadRecommendations = useCallback(async (nextPreferences: UserPreferences, nextHiddenCourseIds: string[]) => {
    setIsLoading(true)
    setRecommendationsError(false)

    try {
      const nextRecommendations = await fetchHomeRecommendations(
        nextPreferences,
        nextHiddenCourseIds,
        likedCourseStorage.read()
      )

      setPersonalRecommendations(nextRecommendations.personalRecommendations)
      setInterestRecommendations(nextRecommendations.interestRecommendations)
    } catch {
      setRecommendationsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [likedCourseStorage])

  useEffect(() => {
    if (status === 'loading' || !router.isReady) {
      return
    }

    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    const nextPreferences = userPreferencesStorage.read()
    const nextHiddenCourseIds = hiddenCourseStorage.read()
    const pendingOnboardingValue = readLocalStorageText(pendingOnboardingStorageKey)
    const isPendingOnboarding = isPendingOnboardingForUser(pendingOnboardingValue, session?.user?.email)
    const isRegistrationOnboarding = router.query.onboarding === '1'
    const shouldOpenOnboarding = (isRegistrationOnboarding || isPendingOnboarding) && !nextPreferences.onboarded

    setPreferences(nextPreferences)
    setHiddenCourseIds(nextHiddenCourseIds)
    setShouldShowOnboardingModal(shouldOpenOnboarding)
    removeLocalStorageValue(pendingOnboardingStorageKey)
    if (nextPreferences.onboarded) {
      loadRecommendations(nextPreferences, nextHiddenCourseIds)
    } else {
      setIsLoading(false)
    }
  }, [hiddenCourseStorage, isAuthenticated, loadRecommendations, router, session?.user?.email, status, userPreferencesStorage])

  const handleSavePreferences = async (nextPreferences: UserPreferences) => {
    setPreferences(nextPreferences)
    userPreferencesStorage.save(nextPreferences)
    removeLocalStorageValue(pendingOnboardingStorageKey)
    setShouldShowOnboardingModal(false)
    router.replace('/', undefined, { shallow: true })
    toast.success('Настройки сохранены, рекомендации обновлены')

    try {
      await saveUserPreferences(nextPreferences)
    } catch {
      toast.info('Настройки сохранены локально')
    }

    loadRecommendations(nextPreferences, hiddenCourseIds)
  }

  const handleHide = async (courseId: string) => {
    const nextHiddenIds = Array.from(new Set([...hiddenCourseIds, courseId]))

    setHiddenCourseIds(nextHiddenIds)
    hiddenCourseStorage.save(nextHiddenIds)

    try {
      await sendCourseInteraction(courseId, 'hide')
    } catch {
      toast.info('Действие сохранено локально')
    }

    await loadRecommendations(preferences, nextHiddenIds)
    toast.success('Курс скрыт из рекомендаций')
  }

  const handleLike = async (courseId: string) => {
    const nextLikedIds = Array.from(new Set([...likedCourseStorage.read(), courseId]))

    likedCourseStorage.save(nextLikedIds)

    try {
      await sendCourseInteraction(courseId, 'like')
    } catch {
      toast.info('Действие сохранено локально')
    }

    await loadRecommendations(preferences, hiddenCourseIds)
    toast.success('Отметка учтена для будущих рекомендаций')
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
      {shouldShowOnboardingModal && <PreferencesModal onSave={handleSavePreferences} />}
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
