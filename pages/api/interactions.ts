import type { NextApiRequest, NextApiResponse } from 'next'
import { getSessionUserId } from '../../lib/server/apiSession'
import {
  isInteractionType,
  saveInteraction,
  type InteractionType
} from '../../lib/server/interactionsRepository'

type InteractionRequest = {
  courseId?: string
  type?: string
  metadata?: Record<string, unknown>
}

type InteractionResponse = {
  ok: boolean
  type: InteractionType
  courseId?: string
}

function parseInteractionRequest(body: unknown): InteractionRequest {
  if (!body || typeof body !== 'object') {
    return {}
  }

  const requestBody = body as Record<string, unknown>

  return {
    courseId: typeof requestBody.courseId === 'string' ? requestBody.courseId : undefined,
    metadata: typeof requestBody.metadata === 'object' && requestBody.metadata !== null
      ? requestBody.metadata as Record<string, unknown>
      : undefined,
    type: typeof requestBody.type === 'string' ? requestBody.type : undefined
  }
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<InteractionResponse | { message: string }>
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

  const { courseId, metadata, type } = parseInteractionRequest(request.body)

  if (!type || !isInteractionType(type)) {
    response.status(400).json({ message: 'Interaction type is required' })
    return
  }

  await saveInteraction(userEmail, type, courseId, metadata)

  response.status(200).json({
    ok: true,
    type,
    courseId
  })
}
