import type { NextApiRequest, NextApiResponse } from 'next'
import { getSessionUserId } from '../../../lib/server/apiSession'
import { getStoredPreferences, saveStoredPreferences } from '../../../lib/server/preferencesRepository'
import type { UserPreferences } from '../../../lib/types'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<UserPreferences | { message: string }>
) {
  const userEmail = await getSessionUserId(request, response)

  if (!userEmail) {
    response.status(401).json({ message: 'Authentication required' })
    return
  }

  if (request.method === 'GET') {
    response.status(200).json(await getStoredPreferences(userEmail))
    return
  }

  if (request.method === 'PUT') {
    response.status(200).json(await saveStoredPreferences(userEmail, request.body))
    return
  }

  response.setHeader('Allow', 'GET, PUT')
  response.status(405).json({ message: 'Method not allowed' })
}
