import type { NextApiRequest, NextApiResponse } from 'next'
import { courseExists } from '../../../lib/server/courseRepository'
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
  const isExistingCourse = await courseExists(courseId)

  if (!isExistingCourse) {
    response.status(404).json({ message: 'Course not found' })
    return
  }

  await enrollUser(userEmail, courseId)

  response.status(200).json({
    ok: true,
    courseId,
    status: 'enrolled'
  })
}
