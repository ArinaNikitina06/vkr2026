import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultPreferences } from '../../lib/data/preferences'
import { getQueryValue, parseCommaSeparatedList } from '../../lib/queryParams'
import { getSimilarCourses, rankCourses } from '../../lib/recommendations/rank'
import { getCoursesFromDatabase } from '../../lib/server/courseRepository'
import type { CourseLevel, RecommendationItem, UserPreferences } from '../../lib/types'

type RecommendationSectionResponse = {
  title: string
  items: RecommendationItem[]
}

type RecommendationsResponse = {
  sections: RecommendationSectionResponse[]
}

function parsePreferences(request: NextApiRequest): UserPreferences {
  const goal = getQueryValue(request.query.goal) ?? defaultPreferences.goal
  const level = (getQueryValue(request.query.level) ?? defaultPreferences.level) as CourseLevel
  const interests = parseCommaSeparatedList(request.query.interests)

  return {
    ...defaultPreferences,
    goal,
    level,
    interests: interests.length > 0 ? interests : defaultPreferences.interests,
    consent: true,
    onboarded: true
  }
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<RecommendationsResponse | { message: string }>
) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.status(405).json({ message: 'Method not allowed' })
    return
  }

  const context = getQueryValue(request.query.context) ?? 'home'
  const hiddenCourseIds = parseCommaSeparatedList(request.query.hidden)
  const likedCourseIds = parseCommaSeparatedList(request.query.liked)
  const bookmarkedCourseIds = parseCommaSeparatedList(request.query.bookmarked)
  const courses = await getCoursesFromDatabase()

  if (context === 'course') {
    const courseId = getQueryValue(request.query.courseId)
    const course = courses.find((item) => item.id === courseId)

    if (!course) {
      response.status(404).json({ message: 'Course not found' })
      return
    }

    response.status(200).json({
      sections: [
        {
          title: 'Похожие курсы',
          items: getSimilarCourses(course, courses, {
            likedCourseIds,
            bookmarkedCourseIds
          })
        }
      ]
    })
    return
  }

  const preferences = parsePreferences(request)
  const rankedCourses = rankCourses(courses, preferences, {
    hiddenCourseIds,
    likedCourseIds,
    bookmarkedCourseIds
  })
  const interestCourses = rankedCourses.filter((item) => (
    item.course.tags.some((tag) => preferences.interests.includes(tag))
  ))

  response.status(200).json({
    sections: [
      {
        title: 'Для вас',
        items: rankedCourses.slice(0, 4)
      },
      {
        title: 'На основе ваших интересов',
        items: interestCourses.slice(0, 4)
      }
    ]
  })
}
