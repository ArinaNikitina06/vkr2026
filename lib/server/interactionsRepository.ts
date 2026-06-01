import { getDemoUser } from './demoUser'
import { courseExists, ensureCoursesSeeded } from './courseRepository'
import { prisma } from './prisma'

export type InteractionType = 'view' | 'like' | 'hide' | 'bookmark' | 'search'

export async function saveInteraction(
  type: InteractionType,
  courseId?: string,
  metadata?: Record<string, unknown>
) {
  await ensureCoursesSeeded()
  const user = await getDemoUser()
  const safeCourseId = courseId && await courseExists(courseId) ? courseId : undefined
  const safeMetadata = courseId && !safeCourseId
    ? { ...metadata, skippedCourseId: courseId }
    : metadata

  return prisma.userInteraction.create({
    data: {
      userId: user.id,
      courseId: safeCourseId,
      type,
      metadataJson: safeMetadata ? JSON.stringify(safeMetadata) : undefined
    }
  })
}

export async function enrollDemoUser(courseId: string) {
  await ensureCoursesSeeded()
  const user = await getDemoUser()

  return prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId
      }
    },
    update: {
      status: 'enrolled'
    },
    create: {
      userId: user.id,
      courseId,
      status: 'enrolled'
    }
  })
}
