import type { Course, RecommendationItem, UserPreferences } from '../types'

export function rankCourses(
  courses: Course[],
  preferences: UserPreferences,
  hiddenCourseIds: string[] = []
): RecommendationItem[] {
  return courses
    .filter((course) => !hiddenCourseIds.includes(course.id))
    .map((course) => {
      const reasons: string[] = []
      let score = course.rating

      if (preferences.interests.some((interest) => course.tags.includes(interest))) {
        score += 2
        reasons.push('Соответствует выбранным интересам')
      }

      if (course.level === preferences.level) {
        score += 1.5
        reasons.push(`Подходит уровню «${preferences.level}»`)
      }

      if (preferences.goal === 'Смена карьеры' && ['РАЗРАБОТКА', 'ДИЗАЙН', 'ДАННЫЕ'].includes(course.category)) {
        score += 1
        reasons.push('Подходит для смены карьерного направления')
      }

      if (preferences.goal === 'Сертификация' && course.price !== 'Бесплатно') {
        score += 0.7
        reasons.push('Подходит для структурного обучения')
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

export function getSimilarCourses(course: Course, courses: Course[]): RecommendationItem[] {
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

      return {
        course: item,
        score,
        reasons: reasons.length > 0 ? reasons : ['Может расширить вашу траекторию обучения']
      }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
}
