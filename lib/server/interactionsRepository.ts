import { courseExists, ensureCoursesSeeded } from './courseRepository'
import { prisma } from './prisma'

export const interactionTypes = ['view', 'like', 'hide', 'bookmark', 'search'] as const

export type InteractionType = (typeof interactionTypes)[number]

export function isInteractionType(value: string): value is InteractionType {
  return interactionTypes.includes(value as InteractionType)
}

export async function saveInteraction(
  userEmail: string,
  type: InteractionType,
  courseId?: string,
  metadata?: Record<string, unknown>
) {
  await ensureCoursesSeeded()
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    }
  })

  if (!user) {
    return null
  }

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

export async function enrollUser(userEmail: string, courseId: string) {
  await ensureCoursesSeeded()
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    }
  })

  if (!user) {
    return null
  }

  const enrollment = await prisma.enrollment.upsert({
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

  await prisma.progress.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId
      }
    },
    update: {},
    create: {
      userId: user.id,
      courseId,
      percent: 0
    }
  })

  return enrollment
}
