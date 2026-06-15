import { defaultPreferences } from '../data/preferences'
import { parseJsonArray } from '../json'
import { isCourseLevel } from '../types'
import type { UserPreferences } from '../types'
import { prisma } from './prisma'

function parseInterests(value: string | null | undefined): string[] {
  return parseJsonArray<string>(value, defaultPreferences.interests)
}

function parseStoredLevel(value: string): UserPreferences['level'] {
  return isCourseLevel(value) ? value : defaultPreferences.level
}

export async function getStoredPreferences(userEmail: string): Promise<UserPreferences> {
  try {
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
      level: parseStoredLevel(preferences.level),
      consent: preferences.consent,
      onboarded: preferences.onboarded
    }
  } catch {
    return defaultPreferences
  }
}

export async function saveStoredPreferences(userEmail: string, input: Partial<UserPreferences>): Promise<UserPreferences> {
  const nextPreferences: UserPreferences = {
    ...defaultPreferences,
    ...input,
    interests: input.interests ?? defaultPreferences.interests,
    onboarded: true
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    })

    if (!user) {
      return nextPreferences
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
      level: parseStoredLevel(preferences.level),
      consent: preferences.consent,
      onboarded: preferences.onboarded
    }
  } catch {
    return nextPreferences
  }
}
