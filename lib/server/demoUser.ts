import { defaultPreferences } from '../data/preferences'
import { prisma } from './prisma'

export const demoUserEmail = 'demo@vkr.local'

export async function getDemoUser() {
  const user = await prisma.user.upsert({
    where: { email: demoUserEmail },
    update: {},
    create: {
      email: demoUserEmail,
      name: 'Арина',
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
