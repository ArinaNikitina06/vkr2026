export const courseLevels = ['Начальный', 'Средний', 'Продвинутый'] as const

export type CourseLevel = (typeof courseLevels)[number]

export const courseCategories = ['ДИЗАЙН', 'РАЗРАБОТКА', 'БИЗНЕС', 'ДАННЫЕ', 'МАРКЕТИНГ'] as const

export type CourseCategory = (typeof courseCategories)[number]

export const catalogAllCategory = 'Все'

export type CatalogCourseCategory = 'Дизайн' | 'Разработка' | 'Бизнес' | 'Данные' | 'Маркетинг'

export type CatalogCategory = typeof catalogAllCategory | CatalogCourseCategory

export const catalogCategoryLabels: Record<CourseCategory, CatalogCourseCategory> = {
  ДИЗАЙН: 'Дизайн',
  РАЗРАБОТКА: 'Разработка',
  БИЗНЕС: 'Бизнес',
  ДАННЫЕ: 'Данные',
  МАРКЕТИНГ: 'Маркетинг'
}

export function isCourseLevel(value: string): value is CourseLevel {
  return courseLevels.includes(value as CourseLevel)
}

export function isCourseCategory(value: string): value is CourseCategory {
  return courseCategories.includes(value as CourseCategory)
}

export type CurriculumItem = {
  title: string
  sections: number
}

export type Course = {
  id: string
  image: string
  category: CourseCategory
  title: string
  description: string
  tags: string[]
  duration: string
  students: number
  level: CourseLevel
  rating: number
  reviews: number
  price?: string
  fullDescription?: string
  previewImage?: string
  instructor?: string
  instructorImage?: string
  instructorDescription?: string
  includes?: string[]
  curriculum?: CurriculumItem[]
  progress?: number
}

export type LearningCourse = Course & {
  progress?: number
}

export type UserPreferences = {
  goal: string
  interests: string[]
  level: CourseLevel
  consent: boolean
  onboarded: boolean
}

export type RecommendationItem = {
  course: Course
  score: number
  reasons: string[]
}
