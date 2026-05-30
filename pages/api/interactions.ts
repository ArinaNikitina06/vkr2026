import type { NextApiRequest, NextApiResponse } from 'next'

type InteractionType = 'view' | 'like' | 'hide' | 'bookmark' | 'search'

type InteractionRequest = {
  courseId?: string
  type?: InteractionType
  metadata?: Record<string, unknown>
}

type InteractionResponse = {
  ok: boolean
  type: InteractionType
  courseId?: string
}

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<InteractionResponse | { message: string }>
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({ message: 'Method not allowed' })
    return
  }

  const { courseId, type } = request.body as InteractionRequest

  if (!type) {
    response.status(400).json({ message: 'Interaction type is required' })
    return
  }

  response.status(200).json({
    ok: true,
    type,
    courseId
  })
}
