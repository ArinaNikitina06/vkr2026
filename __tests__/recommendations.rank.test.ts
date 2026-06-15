import { getSimilarCourses, rankCourses } from '../lib/recommendations/rank'
import type { Course, UserPreferences } from '../lib/types'

const basePreferences: UserPreferences = {
  goal: 'Смена карьеры',
  interests: ['React', 'UX'],
  level: 'Начальный',
  consent: true,
  onboarded: true
}

const courses: Course[] = [
  {
    id: 'ui-basics',
    image: '/courses/ui.jpg',
    category: 'ДИЗАЙН',
    title: 'Основы UI дизайна',
    description: 'Базовый курс по интерфейсам',
    tags: ['UX', 'Figma'],
    duration: '4ч 20м',
    students: 1800,
    level: 'Начальный',
    rating: 4.6,
    reviews: 120,
    price: 'Бесплатно'
  },
  {
    id: 'react-start',
    image: '/courses/react.jpg',
    category: 'РАЗРАБОТКА',
    title: 'React для начинающих',
    description: 'Компоненты и состояние',
    tags: ['React', 'JavaScript'],
    duration: '6ч 00м',
    students: 3200,
    level: 'Начальный',
    rating: 4.7,
    reviews: 180,
    price: '9 900 ₽'
  },
  {
    id: 'marketing',
    image: '/courses/marketing.jpg',
    category: 'МАРКЕТИНГ',
    title: 'Цифровой маркетинг',
    description: 'SEO и контент',
    tags: ['SEO', 'Контент'],
    duration: '7ч 20м',
    students: 900,
    level: 'Средний',
    rating: 4.8,
    reviews: 80,
    price: '7 500 ₽'
  },
  {
    id: 'figma-pro',
    image: '/courses/figma.jpg',
    category: 'ДИЗАЙН',
    title: 'Figma для профессионалов',
    description: 'Продвинутые техники работы с дизайн-системами',
    tags: ['Figma', 'UX'],
    duration: '5ч 10м',
    students: 1600,
    level: 'Продвинутый',
    rating: 4.5,
    reviews: 95,
    price: '8 500 ₽'
  }
]

describe('recommendation ranking', () => {
  it('excludes hidden courses from the recommendation list', () => {
    const rankedCourses = rankCourses(courses, basePreferences, {
      hiddenCourseIds: ['react-start']
    })

    expect(rankedCourses.map((item) => item.course.id)).not.toContain('react-start')
  })

  it('prioritizes courses that match interests, goal and level', () => {
    const [firstCourse] = rankCourses(courses, basePreferences)

    expect(firstCourse.course.id).toBe('react-start')
    expect(firstCourse.reasons).toEqual(expect.arrayContaining([
      'Соответствует вашим интересам',
      'Соответствует вашей цели',
      'Подходит вашему уровню'
    ]))
  })

  it('returns similar courses with explanation reasons', () => {
    const similarCourses = getSimilarCourses(courses[0], courses, {
      likedCourseIds: ['react-start']
    })

    expect(similarCourses).toHaveLength(3)
    expect(similarCourses[0].course.id).not.toBe('ui-basics')
    expect(similarCourses[0].reasons.length).toBeGreaterThan(0)
  })

  it('marks directly liked courses with a clear reason', () => {
    const likedCourse = rankCourses(courses, basePreferences, {
      likedCourseIds: ['react-start']
    }).find((item) => item.course.id === 'react-start')

    expect(likedCourse?.reasons).toContain('Вы отметили этот курс как полезный')
  })

  it('uses liked courses as a signal for related recommendations', () => {
    const figmaCourse = rankCourses(courses, {
      ...basePreferences,
      interests: [],
      level: 'Средний'
    }, {
      likedCourseIds: ['ui-basics']
    }).find((item) => item.course.id === 'figma-pro')

    expect(figmaCourse?.reasons).toContain('Похож на отмеченные вами курсы')
  })

  it('keeps a fallback reason when the course does not match current preferences', () => {
    const [fallbackCourse] = rankCourses([courses[0]], {
      ...basePreferences,
      goal: 'Сертификация',
      interests: [],
      level: 'Продвинутый'
    })

    expect(fallbackCourse.reasons).toEqual(['Может расширить выбор курсов'])
  })
})
