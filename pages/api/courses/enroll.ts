import type { NextApiRequest, NextApiResponse } from 'next'
import { getCourseById } from '../../../lib/data/courses'

type EnrollResponse = {
  ok: boolean
  courseId: string
  status: 'enrolled'
}

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<EnrollResponse | { message: string }>
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({ message: 'Method not allowed' })
    return
  }

  const courseId = String(request.body?.courseId ?? '')
  const course = getCourseById(courseId)

  response.status(200).json({
    ok: true,
    courseId: course.id,
    status: 'enrolled'
  })
}
