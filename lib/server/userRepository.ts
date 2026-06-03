import { defaultPreferences } from '../data/preferences'
import { prisma } from './prisma'

export async function getOrCreateUser(email: string, name?: string) {
  const safeEmail = email.trim().toLowerCase()
  const fallbackName = safeEmail.split('@')[0] || 'Пользователь'
  const existingUser = await prisma.user.findUnique({
    where: {
      email: safeEmail
    }
  })

  if (existingUser) {
    if (name) {
      return prisma.user.update({
        where: {
          email: safeEmail
        },
        data: {
          name
        }
      })
    }

    return existingUser
  }

  return prisma.user.create({
    data: {
      email: safeEmail,
      name: name ?? fallbackName,
      preferences: {
        create: {
          goal: defaultPreferences.goal,
          interestsJson: JSON.stringify(defaultPreferences.interests),
          level: defaultPreferences.level,
          consent: defaultPreferences.consent,
          onboarded: defaultPreferences.onboarded
        }
      }
    }
  })
}
