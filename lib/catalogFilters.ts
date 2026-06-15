import { catalogAllCategory } from './types'
import type { CatalogCategory, Course, CourseLevel } from './types'

export type CatalogLevel = typeof catalogAllCategory | CourseLevel
export type CatalogSort = 'popular' | 'rating' | 'price-asc' | 'duration'

export const defaultCatalogSort: CatalogSort = 'popular'

export const catalogLevels: CatalogLevel[] = [catalogAllCategory, 'Начальный', 'Средний', 'Продвинутый']

export const sortOptions: { value: CatalogSort; label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'duration', label: 'По длительности' }
]

export function isCatalogSort(value: string): value is CatalogSort {
  return sortOptions.some((option) => option.value === value)
}

type FilterCoursesParams = {
  courses: Course[]
  category: CatalogCategory
  level: CatalogLevel
  search: string
  sort: CatalogSort
}

function parsePrice(price: string | undefined): number {
  if (!price || price === 'Бесплатно') {
    return 0
  }

  return +price.replace(/[^\d]/g, '') || 0
}

function parseDuration(duration: string): number {
  const hours = duration.match(/(\d+)ч/)
  const minutes = duration.match(/(\d+)м/)

  return (hours ? +hours[1] * 60 : 0) + (minutes ? +minutes[1] : 0)
}

function checkCourseSearch(course: Course, search: string): boolean {
  const query = search.trim().toLowerCase()

  if (!query) {
    return true
  }

  return [course.title, course.description, course.category, ...course.tags]
    .some((value) => value.toLowerCase().includes(query))
}

export function filterCourses({
  courses,
  category,
  level,
  search,
  sort
}: FilterCoursesParams): Course[] {
  return courses
    .filter((course) => {
      const matchesCategory = category === catalogAllCategory || course.category === category.toUpperCase()
      const matchesLevel = level === catalogAllCategory || course.level === level

      return matchesCategory && matchesLevel && checkCourseSearch(course, search)
    })
    .sort((left, right) => {
      if (sort === 'rating') {
        return right.rating - left.rating
      }

      if (sort === 'price-asc') {
        return parsePrice(left.price) - parsePrice(right.price)
      }

      if (sort === 'duration') {
        return parseDuration(left.duration) - parseDuration(right.duration)
      }

      return right.students - left.students
    })
}
