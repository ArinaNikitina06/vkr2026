import type { NextApiRequest, NextApiResponse } from 'next'
import { getCoursesFromDatabase } from '../../../lib/server/courseRepository'
import { getSessionUserId } from '../../../lib/server/apiSession'
import { enrollUser } from '../../../lib/server/interactionsRepository'

type EnrollResponse = {
  ok: boolean
  courseId: string
  status: 'enrolled'
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<EnrollResponse | { message: string }>
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({ message: 'Method not allowed' })
    return
  }

  const userEmail = await getSessionUserId(request, response)

  if (!userEmail) {
    response.status(401).json({ message: 'Authentication required' })
    return
  }

  const courseId = String(request.body?.courseId ?? '')
  const courses = await getCoursesFromDatabase()
  const course = courses.find((item) => item.id === courseId) ?? courses[0]
  await enrollUser(userEmail, course.id)

  response.status(200).json({
    ok: true,
    courseId: course.id,
    status: 'enrolled'
  })
}
