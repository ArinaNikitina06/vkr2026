import type { UserPreferences } from '../types'

export const preferenceGoals = [
  'Смена карьеры',
  'Улучшение навыков',
  'Личный интерес',
  'Сертификация'
] as const

export const preferenceInterests = [
  'Дизайн',
  'Разработка',
  'Бизнес',
  'Данные',
  'Маркетинг'
] as const

export const preferenceLevels = ['Начальный', 'Средний', 'Продвинутый'] as const

export const defaultPreferences: UserPreferences = {
  goal: 'Смена карьеры',
  interests: [],
  level: 'Начальный',
  consent: false,
  onboarded: false
}

export const preferencesStorageKey = 'eduflow.preferences'
export const pendingOnboardingStorageKey = 'eduflow.pendingOnboarding'
export const hiddenCoursesStorageKey = 'eduflow.hiddenCourses'
export const likedCoursesStorageKey = 'eduflow.likedCourses'
export const bookmarkedCoursesStorageKey = 'eduflow.bookmarkedCourses'

export function getUserPreferencesStorageKey(email?: string | null): string {
  return email ? `${preferencesStorageKey}.${email}` : preferencesStorageKey
}

export function createPendingOnboardingValue(email: string): string {
  return JSON.stringify({
    email: email.trim().toLowerCase(),
    createdAt: Date.now()
  })
}

export function isPendingOnboardingForUser(value: string | null, email?: string | null): boolean {
  if (!value || !email) {
    return false
  }

  try {
    const pendingOnboarding = JSON.parse(value) as { email?: string }

    return pendingOnboarding.email === email.trim().toLowerCase()
  } catch {
    return false
  }
}
