import Header from '../components/Header'
import Button from '../components/ui/Button'
import CourseGrid from '../components/CourseGrid'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LearningCourseList from '../components/LearningCourseList'
import RecommendationSection from '../components/RecommendationSection'
import RecommendationCourseGrid from '../components/RecommendationCourseGrid'
import SkeletonCard from '../components/SkeletonCard'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PreferencesModal from '../components/PreferencesModal'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useLocalStorage } from '../hooks/useLocalStorage'
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
import { authOptions } from '../lib/server/authOptions'
import { getCoursesFromDatabase, getLearningCoursesForUser } from '../lib/server/courseRepository'
import { readLocalStorageText, removeLocalStorageValue } from '../lib/storage'
import { getUserDisplayName } from '../lib/userDisplay'
import type { Course, LearningCourse, RecommendationItem, UserPreferences } from '../lib/types'

const registrationOnboardingFlag = '1'
const emptyCourseIds: string[] = []

type HomeProps = {
  courses: Course[]
  learningCourses: LearningCourse[]
}

type StoredHomeState = {
  hiddenCourseIds: string[]
  preferences: UserPreferences
  shouldOpenOnboarding: boolean
}

function isOnboardingRequested(queryValue: string | string[] | undefined): boolean {
  return Array.isArray(queryValue)
    ? queryValue.includes(registrationOnboardingFlag)
    : queryValue === registrationOnboardingFlag
}

function shouldOpenOnboarding(
  preferences: UserPreferences,
  isRegistrationOnboarding: boolean,
  isPendingOnboarding: boolean
): boolean {
  return (isRegistrationOnboarding || isPendingOnboarding) && !preferences.onboarded
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  const [courses, learningCourses] = await Promise.all([
    getCoursesFromDatabase(),
    getLearningCoursesForUser(session?.user?.email)
  ])

  return {
    props: {
      courses,
      learningCourses: learningCourses.inProgress
    }
  }
}

export default function Home({ courses, learningCourses }: HomeProps): JSX.Element {
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

  const readStoredHomeState = useCallback((): StoredHomeState => {
    const storedPreferences = userPreferencesStorage.read()
    const storedHiddenCourseIds = hiddenCourseStorage.read()
    const pendingOnboardingValue = readLocalStorageText(pendingOnboardingStorageKey)
    const isPendingOnboarding = isPendingOnboardingForUser(pendingOnboardingValue, session?.user?.email)
    const isRegistrationOnboarding = isOnboardingRequested(router.query.onboarding)

    return {
      hiddenCourseIds: storedHiddenCourseIds,
      preferences: storedPreferences,
      shouldOpenOnboarding: shouldOpenOnboarding(
        storedPreferences,
        isRegistrationOnboarding,
        isPendingOnboarding
      )
    }
  }, [hiddenCourseStorage, router.query.onboarding, session?.user?.email, userPreferencesStorage])

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

  const applyStoredHomeState = useCallback((homeState: StoredHomeState) => {
    setPreferences(homeState.preferences)
    setHiddenCourseIds(homeState.hiddenCourseIds)
    setShouldShowOnboardingModal(homeState.shouldOpenOnboarding)
    removeLocalStorageValue(pendingOnboardingStorageKey)

    if (homeState.preferences.onboarded) {
      loadRecommendations(homeState.preferences, homeState.hiddenCourseIds)
      return
    }

    setIsLoading(false)
  }, [loadRecommendations])

  const syncPreferencesWithServer = async (nextPreferences: UserPreferences): Promise<void> => {
    try {
      await saveUserPreferences(nextPreferences)
    } catch {
      toast.info('Настройки сохранены локально')
    }
  }

  const saveInteraction = async (courseId: string, type: 'click' | 'hide' | 'like'): Promise<void> => {
    try {
      await sendCourseInteraction(courseId, type)
    } catch {
      toast.info('Действие сохранено локально')
    }
  }

  useEffect(() => {
    if (status === 'loading' || !router.isReady) {
      return
    }

    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    applyStoredHomeState(readStoredHomeState())
  }, [applyStoredHomeState, isAuthenticated, readStoredHomeState, router.isReady, status])

  const handleSavePreferences = async (nextPreferences: UserPreferences) => {
    setPreferences(nextPreferences)
    userPreferencesStorage.save(nextPreferences)
    removeLocalStorageValue(pendingOnboardingStorageKey)
    setShouldShowOnboardingModal(false)
    router.replace('/', undefined, { shallow: true })
    toast.success('Настройки сохранены, рекомендации обновлены')
    await syncPreferencesWithServer(nextPreferences)

    loadRecommendations(nextPreferences, hiddenCourseIds)
  }

  const handleHide = async (courseId: string) => {
    const nextHiddenIds = Array.from(new Set([...hiddenCourseIds, courseId]))

    setHiddenCourseIds(nextHiddenIds)
    hiddenCourseStorage.save(nextHiddenIds)
    await saveInteraction(courseId, 'hide')

    await loadRecommendations(preferences, nextHiddenIds)
    toast.success('Курс скрыт из рекомендаций')
  }

  const handleLike = async (courseId: string) => {
    const nextLikedIds = Array.from(new Set([...likedCourseStorage.read(), courseId]))

    likedCourseStorage.save(nextLikedIds)
    await saveInteraction(courseId, 'like')

    await loadRecommendations(preferences, hiddenCourseIds)
    toast.success('Отметка учтена для будущих рекомендаций')
  }

  const handleOpenCourse = (courseId: string) => {
    void saveInteraction(courseId, 'click')
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
              {learningCourses.length > 0 ? (
                <LearningCourseList courses={learningCourses} />
              ) : (
                <EmptyState
                  title="Пока нет начатых курсов"
                  description="Запишитесь на курс, чтобы продолжить обучение с главной страницы."
                  action={<Link href="/catalog" className="button button--secondary">Открыть каталог</Link>}
                />
              )}
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
                <Button
                  variant="secondary"
                  onClick={() => loadRecommendations(preferences, hiddenCourseIds)}
                >
                  Повторить
                </Button>
              )}
            />
          ) : personalRecommendations.length > 0 ? (
            <RecommendationCourseGrid
              items={personalRecommendations}
              onLike={handleLike}
              onHide={handleHide}
              onOpen={handleOpenCourse}
            />
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
                <Button
                  variant="secondary"
                  onClick={() => loadRecommendations(preferences, hiddenCourseIds)}
                >
                  Повторить
                </Button>
              )}
            />
          ) : (
            <RecommendationCourseGrid
              items={interestRecommendations}
              onLike={handleLike}
              onHide={handleHide}
              onOpen={handleOpenCourse}
            />
          )}
        </RecommendationSection>
      </main>
    </>
  )
}
