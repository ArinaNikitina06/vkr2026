import {
  catalogAllCategory,
  catalogCategoryLabels,
  isCourseCategory,
  isCourseLevel
} from '../types'
import { parseJsonArray } from '../json'
import type { CatalogCategory, Course, CourseCategory, CourseLevel, CurriculumItem, LearningCourse } from '../types'
import { seedCourses } from './courseSeedData'
import { prisma } from './prisma'

type PrismaCourse = Awaited<ReturnType<typeof prisma.course.findMany>>[number]
let didEnsureCourses = false

type CourseSeedData = {
  image: string
  category: CourseCategory
  title: string
  description: string
  fullDescription?: string
  previewImage?: string
  instructor?: string
  instructorImage?: string
  instructorDescription?: string
  tagsJson: string
  duration: string
  students: number
  level: CourseLevel
  rating: number
  reviews: number
  price?: string
  includesJson: string
  curriculumJson: string
}

function parseJsonList(value: string | null | undefined): string[] {
  return parseJsonArray<string>(value, [])
}

function parseCurriculum(value: string | null | undefined): CurriculumItem[] | undefined {
  const parsedCurriculum = parseJsonArray<CurriculumItem>(value, [])

  return parsedCurriculum.length > 0 ? parsedCurriculum : undefined
}

function parseCourseCategory(value: string): CourseCategory {
  return isCourseCategory(value) ? value : 'ДИЗАЙН'
}

function parseCourseLevel(value: string): CourseLevel {
  return isCourseLevel(value) ? value : 'Начальный'
}

export function mapPrismaCourse(course: PrismaCourse): Course {
  return {
    id: course.id,
    image: course.image,
    category: parseCourseCategory(course.category),
    title: course.title,
    description: course.description,
    fullDescription: course.fullDescription ?? undefined,
    previewImage: course.previewImage ?? undefined,
    instructor: course.instructor ?? undefined,
    instructorImage: course.instructorImage ?? undefined,
    instructorDescription: course.instructorDescription ?? undefined,
    tags: parseJsonList(course.tagsJson),
    duration: course.duration,
    students: course.students,
    level: parseCourseLevel(course.level),
    rating: course.rating,
    reviews: course.reviews,
    price: course.price ?? undefined,
    includes: parseJsonList(course.includesJson),
    curriculum: parseCurriculum(course.curriculumJson)
  }
}

function createCourseSeedData(course: Course): CourseSeedData {
  return {
    image: course.image,
    category: course.category,
    title: course.title,
    description: course.description,
    fullDescription: course.fullDescription,
    previewImage: course.previewImage,
    instructor: course.instructor,
    instructorImage: course.instructorImage,
    instructorDescription: course.instructorDescription,
    tagsJson: JSON.stringify(course.tags),
    duration: course.duration,
    students: course.students,
    level: course.level,
    rating: course.rating,
    reviews: course.reviews,
    price: course.price,
    includesJson: JSON.stringify(course.includes ?? []),
    curriculumJson: JSON.stringify(course.curriculum ?? [])
  }
}

export async function ensureCoursesSeeded() {
  if (didEnsureCourses) {
    return
  }

  await Promise.all(
    seedCourses.map((course) => {
      const courseData = createCourseSeedData(course)

      return prisma.course.upsert({
        where: {
          id: course.id
        },
        update: courseData,
        create: {
          id: course.id,
          ...courseData
        }
      })
    })
  )

  didEnsureCourses = true
}

export async function courseExists(courseId: string): Promise<boolean> {
  await ensureCoursesSeeded()

  const course = await prisma.course.findUnique({
    where: {
      id: courseId
    },
    select: {
      id: true
    }
  })

  return Boolean(course)
}

export async function getCoursesFromDatabase(): Promise<Course[]> {
  await ensureCoursesSeeded()

  const dbCourses = await prisma.course.findMany({
    orderBy: {
      id: 'asc'
    }
  })

  return dbCourses.map(mapPrismaCourse)
}

export async function getCourseByIdFromDatabase(courseId: string): Promise<Course | null> {
  await ensureCoursesSeeded()

  const course = await prisma.course.findUnique({
    where: {
      id: courseId
    }
  })

  return course ? mapPrismaCourse(course) : null
}

function formatCatalogCategory(category: CourseCategory): CatalogCategory {
  return catalogCategoryLabels[category]
}

export async function getCatalogCategoriesFromDatabase(): Promise<CatalogCategory[]> {
  await ensureCoursesSeeded()

  const categories = await prisma.course.findMany({
    distinct: ['category'],
    orderBy: {
      category: 'asc'
    },
    select: {
      category: true
    }
  })

  return [
    catalogAllCategory,
    ...categories.map((item) => formatCatalogCategory(parseCourseCategory(item.category)))
  ]
}

export type LearningCourseCollections = {
  inProgress: LearningCourse[]
  saved: Course[]
  completed: Course[]
}

export async function getLearningCoursesForUser(userEmail?: string | null): Promise<LearningCourseCollections> {
  if (!userEmail) {
    return {
      inProgress: [],
      saved: [],
      completed: []
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    },
    select: {
      id: true
    }
  })

  if (!user) {
    return {
      inProgress: [],
      saved: [],
      completed: []
    }
  }

  const [enrollments, progressItems] = await Promise.all([
    prisma.enrollment.findMany({
      where: {
        userId: user.id
      },
      include: {
        course: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.progress.findMany({
      where: {
        userId: user.id
      }
    })
  ])

  const progressByCourseId = new Map(
    progressItems.map((progress) => [progress.courseId, progress.percent])
  )

  return {
    inProgress: enrollments.map((enrollment) => ({
      ...mapPrismaCourse(enrollment.course),
      progress: progressByCourseId.get(enrollment.courseId) ?? 0
    })),
    saved: [],
    completed: []
  }
}
