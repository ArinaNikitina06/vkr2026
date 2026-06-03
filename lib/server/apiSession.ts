import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './authOptions'

export async function getSessionUserId(request: NextApiRequest, response: NextApiResponse): Promise<string | null> {
  const session = await getServerSession(request, response, authOptions)

  return session?.user?.email ?? null
}
