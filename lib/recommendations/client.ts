import type { RecommendationItem, UserPreferences } from '../types'

export type CourseInteractionType = 'like' | 'hide' | 'view'

type RecommendationsResponse = {
  sections: {
    title: string
    items: RecommendationItem[]
  }[]
}

export type RecommendationState = {
  personalRecommendations: RecommendationItem[]
  interestRecommendations: RecommendationItem[]
}

export async function fetchHomeRecommendations(
  preferences: UserPreferences,
  hiddenCourseIds: string[],
  likedCourseIds: string[]
): Promise<RecommendationState> {
  const params = new URLSearchParams({
    goal: preferences.goal,
    level: preferences.level,
    interests: preferences.interests.join(','),
    hidden: hiddenCourseIds.join(','),
    liked: likedCourseIds.join(',')
  })

  const response = await fetch(`/api/recommendations?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Recommendations request failed')
  }

  const data = await response.json() as RecommendationsResponse

  return {
    personalRecommendations: data.sections.find((section) => section.title === 'Для вас')?.items ?? [],
    interestRecommendations: data.sections.find((section) => section.title === 'На основе ваших интересов')?.items ?? []
  }
}

export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  const response = await fetch('/api/user/preferences', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preferences)
  })

  if (!response.ok) {
    throw new Error('Preferences request failed')
  }
}

export async function sendCourseInteraction(courseId: string, type: CourseInteractionType): Promise<void> {
  const response = await fetch('/api/interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ courseId, type })
  })

  if (!response.ok) {
    throw new Error('Interaction request failed')
  }
}
