import { defaultPreferences } from '../data/preferences'
import { prisma } from './prisma'

export const demoUserEmail = 'demo@vkr.local'

export async function getOrCreateUser(email = demoUserEmail, name?: string) {
  const fallbackName = email.split('@')[0] || 'Пользователь'
  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    if (name) {
      return prisma.user.update({
        where: {
          email
        },
        data: {
          name
        }
      })
    }

    return existingUser
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
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

  return user
}

export async function getDemoUser() {
  return getOrCreateUser(demoUserEmail, 'Demo user')
}
