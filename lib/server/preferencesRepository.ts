import { defaultPreferences } from '../data/preferences'
import type { CourseLevel, UserPreferences } from '../types'
import { prisma } from './prisma'

function parseInterests(value: string | null | undefined): string[] {
  if (!value) {
    return defaultPreferences.interests
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : defaultPreferences.interests
  } catch {
    return defaultPreferences.interests
  }
}

export async function getStoredPreferences(userEmail: string): Promise<UserPreferences> {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    }
  })

  if (!user) {
    return defaultPreferences
  }

  const preferences = await prisma.userPreference.findUnique({
    where: {
      userId: user.id
    }
  })

  if (!preferences) {
    return defaultPreferences
  }

  return {
    goal: preferences.goal,
    interests: parseInterests(preferences.interestsJson),
    level: preferences.level as CourseLevel,
    consent: preferences.consent,
    onboarded: preferences.onboarded
  }
}

export async function saveStoredPreferences(userEmail: string, input: Partial<UserPreferences>): Promise<UserPreferences> {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    }
  })

  if (!user) {
    return defaultPreferences
  }

  const nextPreferences: UserPreferences = {
    ...defaultPreferences,
    ...input,
    interests: input.interests ?? defaultPreferences.interests,
    onboarded: true
  }

  const preferences = await prisma.userPreference.upsert({
    where: {
      userId: user.id
    },
    update: {
      goal: nextPreferences.goal,
      interestsJson: JSON.stringify(nextPreferences.interests),
      level: nextPreferences.level,
      consent: nextPreferences.consent,
      onboarded: nextPreferences.onboarded
    },
    create: {
      userId: user.id,
      goal: nextPreferences.goal,
      interestsJson: JSON.stringify(nextPreferences.interests),
      level: nextPreferences.level,
      consent: nextPreferences.consent,
      onboarded: nextPreferences.onboarded
    }
  })

  return {
    goal: preferences.goal,
    interests: parseInterests(preferences.interestsJson),
    level: preferences.level as CourseLevel,
    consent: preferences.consent,
    onboarded: preferences.onboarded
  }
}
