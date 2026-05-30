import type { NextApiRequest, NextApiResponse } from 'next'
import { getStoredPreferences, saveStoredPreferences } from '../../../lib/server/preferencesRepository'
import type { UserPreferences } from '../../../lib/types'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<UserPreferences | { message: string }>
) {
  if (request.method === 'GET') {
    response.status(200).json(await getStoredPreferences())
    return
  }

  if (request.method === 'PUT') {
    response.status(200).json(await saveStoredPreferences(request.body))
    return
  }

  response.setHeader('Allow', 'GET, PUT')
  response.status(405).json({ message: 'Method not allowed' })
}
