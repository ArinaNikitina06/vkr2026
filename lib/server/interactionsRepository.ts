import { getDemoUser } from './demoUser'
import { ensureCoursesSeeded } from './courseRepository'
import { prisma } from './prisma'

export type InteractionType = 'view' | 'like' | 'hide' | 'bookmark' | 'search'

export async function saveInteraction(
  type: InteractionType,
  courseId?: string,
  metadata?: Record<string, unknown>
) {
  await ensureCoursesSeeded()
  const user = await getDemoUser()

  return prisma.userInteraction.create({
    data: {
      userId: user.id,
      courseId,
      type,
      metadataJson: metadata ? JSON.stringify(metadata) : undefined
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
