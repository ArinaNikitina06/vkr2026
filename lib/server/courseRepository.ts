import { courses as mockCourses } from '../data/courses'
import type { Course, CourseCategory, CourseLevel, CurriculumItem } from '../types'
import { prisma } from './prisma'

type PrismaCourse = Awaited<ReturnType<typeof prisma.course.findMany>>[number]
type CourseSeedData = {
  image: string
  category: CourseCategory
  title: string
  description: string
  fullDescription?: string
  previewImage?: string
  instructor?: string
  instructorImage?: string
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
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseCurriculum(value: string | null | undefined): CurriculumItem[] | undefined {
  if (!value) {
    return undefined
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

export function mapPrismaCourse(course: PrismaCourse): Course {
  return {
    id: course.id,
    image: course.image,
    category: course.category as CourseCategory,
    title: course.title,
    description: course.description,
    fullDescription: course.fullDescription ?? undefined,
    previewImage: course.previewImage ?? undefined,
    instructor: course.instructor ?? undefined,
    instructorImage: course.instructorImage ?? undefined,
    tags: parseJsonList(course.tagsJson),
    duration: course.duration,
    students: course.students,
    level: course.level as CourseLevel,
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
  await Promise.all(
    mockCourses.map((course) => {
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
}

export async function courseExists(courseId: string): Promise<boolean> {
  try {
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
  } catch {
    return mockCourses.some((course) => course.id === courseId)
  }
}

export async function getCoursesFromDatabase(): Promise<Course[]> {
  try {
    await ensureCoursesSeeded()

    const dbCourses = await prisma.course.findMany({
      orderBy: {
        id: 'asc'
      }
    })

    return dbCourses.map(mapPrismaCourse)
  } catch {
    return mockCourses
  }
}
