import type { Course, RecommendationItem, UserPreferences } from '../types'

type RecommendationSignals = {
  hiddenCourseIds?: string[]
  likedCourseIds?: string[]
  bookmarkedCourseIds?: string[]
}

function hasCommonTags(course: Course, sourceCourse: Course): boolean {
  return course.tags.some((tag) => sourceCourse.tags.includes(tag))
}

function getSignalCourses(courses: Course[], courseIds: string[]): Course[] {
  const coursesById = new Map(courses.map((course) => [course.id, course]))

  return courseIds
    .map((courseId) => coursesById.get(courseId))
    .filter((course): course is Course => Boolean(course))
}

function checkGoalMatch(course: Course, goal: string): boolean {
  if (goal === 'Смена карьеры') {
    return ['РАЗРАБОТКА', 'ДИЗАЙН', 'ДАННЫЕ'].includes(course.category)
  }

  if (goal === 'Сертификация') {
    return course.price !== 'Бесплатно'
  }

  if (goal === 'Улучшение навыков') {
    return course.level === 'Средний' || course.level === 'Продвинутый'
  }

  return true
}

export function rankCourses(
  courses: Course[],
  preferences: UserPreferences,
  signals: RecommendationSignals = {}
): RecommendationItem[] {
  const hiddenCourseIds = new Set(signals.hiddenCourseIds ?? [])
  const likedCourses = getSignalCourses(courses, signals.likedCourseIds ?? [])
  const bookmarkedCourses = getSignalCourses(courses, signals.bookmarkedCourseIds ?? [])
  const likedCourseIds = new Set(likedCourses.map((course) => course.id))
  const bookmarkedCourseIds = new Set(bookmarkedCourses.map((course) => course.id))
  const signalCourses = [...likedCourses, ...bookmarkedCourses]

  return courses
    .filter((course) => !hiddenCourseIds.has(course.id))
    .map((course) => {
      const reasons: string[] = []
      let score = course.rating

      if (preferences.interests.some((interest) => course.tags.includes(interest))) {
        score += 2
        reasons.push('Соответствует вашим интересам')
      }

      if (checkGoalMatch(course, preferences.goal)) {
        score += 1.2
        reasons.push('Соответствует вашей цели')
      }

      if (course.level === preferences.level) {
        score += 1.5
        reasons.push('Подходит вашему уровню')
      }

      if (likedCourseIds.has(course.id)) {
        score += 1
        reasons.push('Вы отметили этот курс как полезный')
      }

      if (bookmarkedCourseIds.has(course.id)) {
        score += 1
        reasons.push('Курс сохранен в избранном')
      }

      if (signalCourses.some((signalCourse) => signalCourse.id !== course.id && hasCommonTags(course, signalCourse))) {
        score += 1.3
        reasons.push('Похож на сохраненные курсы')
      }

      if (course.students > 2000) {
        score += 0.5
        reasons.push('Популярно среди студентов')
      }

      if (reasons.length === 0) {
        reasons.push('Добавлено как популярный курс для старта')
      }

      return {
        course,
        score,
        reasons
      }
    })
    .sort((left, right) => right.score - left.score)
}

export function getSimilarCourses(
  course: Course,
  courses: Course[],
  signals: Pick<RecommendationSignals, 'likedCourseIds' | 'bookmarkedCourseIds'> = {}
): RecommendationItem[] {
  const likedCourses = getSignalCourses(courses, signals.likedCourseIds ?? [])
  const bookmarkedCourses = getSignalCourses(courses, signals.bookmarkedCourseIds ?? [])
  const signalCourses = [...likedCourses, ...bookmarkedCourses]

  return courses
    .filter((item) => item.id !== course.id)
    .map((item) => {
      const reasons: string[] = []
      let score = item.rating

      if (item.category === course.category) {
        score += 2
        reasons.push('Похожее направление')
      }

      if (item.level === course.level) {
        score += 1
        reasons.push(`Тот же уровень: ${course.level}`)
      }

      if (item.tags.some((tag) => course.tags.includes(tag))) {
        score += 1
        reasons.push('Есть общие темы курса')
      }

      if (signalCourses.some((signalCourse) => signalCourse.id !== item.id && hasCommonTags(item, signalCourse))) {
        score += 1.2
        reasons.push('Похож на сохраненные курсы')
      }

      return {
        course: item,
        score,
        reasons: reasons.length > 0 ? reasons : ['Может расширить вашу траекторию обучения']
      }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
}
