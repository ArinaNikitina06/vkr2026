import { defaultPreferences } from '../data/preferences'
import { prisma } from './prisma'

export const demoUserEmail = 'demo@vkr.local'

export async function getOrCreateUser(email = demoUserEmail, name = 'Арина') {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name
    },
    create: {
      email,
      name,
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
  return getOrCreateUser()
}
