export type CourseLevel = 'Начальный' | 'Средний' | 'Продвинутый'

export type CourseCategory = 'ДИЗАЙН' | 'РАЗРАБОТКА' | 'БИЗНЕС' | 'ДАННЫЕ' | 'МАРКЕТИНГ'

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
  includes?: string[]
  curriculum?: CurriculumItem[]
  progress?: number
}

export type LearningCourse = Course & {
  progress?: number
}
