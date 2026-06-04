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
export const hiddenCoursesStorageKey = 'eduflow.hiddenCourses'
export const likedCoursesStorageKey = 'eduflow.likedCourses'
export const bookmarkedCoursesStorageKey = 'eduflow.bookmarkedCourses'

export function getUserPreferencesStorageKey(email?: string | null): string {
  return email ? `${preferencesStorageKey}.${email}` : preferencesStorageKey
}
