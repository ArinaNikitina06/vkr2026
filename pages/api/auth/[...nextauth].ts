import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { demoUserEmail, getOrCreateUser } from '../../../lib/server/demoUser'

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
        },
        name: {
          label: 'Имя',
          type: 'text',
          placeholder: 'Арина'
        }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim() || demoUserEmail
        const name = credentials?.name?.trim() || email.split('@')[0] || 'Пользователь'
        const user = await getOrCreateUser(email, name)

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
