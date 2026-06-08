import { defaultPreferences } from '../data/preferences'
import { normalizeUserName } from '../userDisplay'
import { prisma } from './prisma'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: normalizeEmail(email)
    }
  })
}

export async function createUser(email: string, name: string | undefined, passwordHash: string) {
  const safeEmail = normalizeEmail(email)
  const safeName = normalizeUserName(name)
  const fallbackName = safeEmail.split('@')[0] || 'Пользователь'

  return prisma.user.create({
    data: {
      email: safeEmail,
      passwordHash,
      name: safeName ?? fallbackName,
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

export async function setUserPassword(userId: string, passwordHash: string, name?: string) {
  const safeName = normalizeUserName(name)

  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      passwordHash,
      ...(safeName ? { name: safeName } : {})
    }
  })
}
