import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultPreferences } from '../../../lib/data/preferences'
import type { UserPreferences } from '../../../lib/types'

let savedPreferences: UserPreferences = defaultPreferences

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<UserPreferences | { message: string }>
) {
  if (request.method === 'GET') {
    response.status(200).json(savedPreferences)
    return
  }

  if (request.method === 'PUT') {
    savedPreferences = {
      ...defaultPreferences,
      ...request.body,
      onboarded: true
    }

    response.status(200).json(savedPreferences)
    return
  }

  response.setHeader('Allow', 'GET, PUT')
  response.status(405).json({ message: 'Method not allowed' })
}
