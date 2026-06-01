import type { Course, LearningCourse } from '../types'

export const courses: Course[] = [
  {
    id: '1',
    image: '/assets/course-design.svg',
    category: 'ДИЗАЙН',
    title: 'Основы UI дизайна',
    description: 'Освойте принципы дизайна интерфейсов, теорию цвета и типографику.',
    fullDescription: 'Этот комплексный курс охватывает все от вайфреймов до высокодетализированных прототипов. Научитесь создавать визуально привлекательные функциональные интерфейсы, которые нравятся пользователям.',
    previewImage: '/assets/course-design.svg',
    instructor: 'Анна Петрова',
    instructorImage: '/assets/course-design.svg',
    tags: ['Дизайн', 'Начальный'],
    duration: '4ч 20м',
    students: 1200,
    level: 'Начальный',
    rating: 4.8,
    reviews: 1240,
    price: 'Бесплатно',
    includes: [
      '4.5 часа видео по запросу',
      '3 загружаемых ресурса',
      'Полный пожизненный доступ',
      'Сертификат о прохождении'
    ],
    curriculum: [
      { title: 'Введение в UI дизайн', sections: 3 },
      { title: 'Цвет и типография', sections: 4 },
      { title: 'Компоненты интерфейса', sections: 5 },
      { title: 'Итоговый проект', sections: 2 }
    ]
  },
  {
    id: '2',
    image: '/assets/course-code.svg',
    category: 'РАЗРАБОТКА',
    title: 'Fullstack Next.js 14',
    description: 'Создавайте масштабируемые приложения с новейшими возможностями Next.js.',
    tags: ['Разработка', 'Продвинутый'],
    duration: '8ч 15м',
    students: 2300,
    level: 'Продвинутый',
    rating: 4.9,
    reviews: 980,
    price: '12 900 ₽'
  },
  {
    id: '3',
    image: '/assets/course-business.svg',
    category: 'БИЗНЕС',
    title: 'Продакт-менеджмент',
    description: 'Научитесь управлять продуктовыми командами и определять стратегию.',
    tags: ['Бизнес', 'Средний'],
    duration: '6ч 00м',
    students: 1500,
    level: 'Средний',
    rating: 4.7,
    reviews: 760,
    price: '9 900 ₽'
  },
  {
    id: '4',
    image: '/assets/course-data.svg',
    category: 'ДАННЫЕ',
    title: 'Data Science с Python',
    description: 'Анализируйте данные и создавайте визуализации с помощью Pandas.',
    tags: ['Данные', 'Начальный'],
    duration: '12ч 45м',
    students: 2100,
    level: 'Начальный',
    rating: 4.8,
    reviews: 1120,
    price: '14 900 ₽'
  },
  {
    id: '5',
    image: '/assets/course-code.svg',
    category: 'РАЗРАБОТКА',
    title: 'JavaScript для начинающих',
    description: 'Изучите основы программирования на JavaScript с нуля.',
    tags: ['Разработка', 'Начальный'],
    duration: '10ч 30м',
    students: 3100,
    level: 'Начальный',
    rating: 4.6,
    reviews: 1420,
    price: 'Бесплатно'
  },
  {
    id: '6',
    image: '/assets/course-design.svg',
    category: 'ДИЗАЙН',
    title: 'Брендинг и айдентика',
    description: 'Создавайте запоминающиеся бренды и визуальные системы.',
    tags: ['Дизайн', 'Продвинутый'],
    duration: '5ч 45м',
    students: 890,
    level: 'Продвинутый',
    rating: 4.7,
    reviews: 430,
    price: '8 900 ₽'
  },
  {
    id: '7',
    image: '/assets/course-marketing.svg',
    category: 'МАРКЕТИНГ',
    title: 'Цифровой маркетинг',
    description: 'Освойте SEO, контент-маркетинг и социальные сети.',
    tags: ['Маркетинг', 'Средний'],
    duration: '7ч 20м',
    students: 1340,
    level: 'Средний',
    rating: 4.5,
    reviews: 520,
    price: '7 900 ₽'
  },
  {
    id: '8',
    image: '/assets/course-business.svg',
    category: 'БИЗНЕС',
    title: 'Финансовая грамотность',
    description: 'Управляйте личными финансами и инвестициями эффективно.',
    tags: ['Бизнес', 'Начальный'],
    duration: '9ч 10м',
    students: 2450,
    level: 'Начальный',
    rating: 4.6,
    reviews: 870,
    price: '6 900 ₽'
  }
]

export const recommendedCourses = courses.slice(0, 4)

export const ongoingCourses: LearningCourse[] = [
  {
    ...courses[1],
    id: 'ongoing-1',
    title: 'Продвинутые паттерны React',
    description: 'Паттерны и лучшие практики для профессиональной разработки.',
    progress: 65
  }
]

export const myLearningCourses = {
  inProgress: [
    ongoingCourses[0],
    {
      ...courses[0],
      id: 'ongoing-2',
      title: 'Дизайн-системы 101',
      description: 'Как создавать и поддерживать масштабируемые дизайн-системы.',
      level: 'Средний',
      tags: ['Дизайн', 'Средний'],
      progress: 12
    },
    {
      ...courses[2],
      id: 'ongoing-3',
      description: 'Научитесь управлять продуктовыми командами.',
      progress: 38
    }
  ],
  saved: [
    {
      ...courses[0],
      id: 'saved-1'
    },
    {
      ...courses[1],
      id: 'saved-2'
    }
  ],
  completed: [
    {
      ...courses[4],
      id: 'completed-1'
    }
  ]
} satisfies Record<'inProgress' | 'saved' | 'completed', LearningCourse[]>

export const catalogCategories = ['Все', 'Разработка', 'Дизайн', 'Бизнес', 'Маркетинг', 'Данные'] as const

export type CatalogCategory = (typeof catalogCategories)[number]

export function getCourseById(id: string | undefined): Course {
  return courses.find((course) => course.id === id) ?? courses[0]
}
