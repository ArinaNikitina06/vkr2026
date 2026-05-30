import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getDemoUser } from '../../../lib/server/demoUser'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? 'demo-secret-change-before-production',
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Demo',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'demo@vkr.local'
        }
      },
      async authorize() {
        const user = await getDemoUser()

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? 'Demo user'
        }
      }
    })
  ]
}

export default NextAuth(authOptions)
