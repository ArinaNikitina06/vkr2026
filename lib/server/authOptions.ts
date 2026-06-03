import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getOrCreateUser } from './userRepository'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? 'demo-secret-change-before-production',
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'name@example.com'
        },
        password: {
          label: 'Пароль',
          type: 'password'
        },
        name: {
          label: 'Имя',
          type: 'text',
          placeholder: 'Арина'
        }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()

        if (!email) {
          return null
        }

        const name = credentials?.name?.trim() || undefined
        const user = await getOrCreateUser(email, name)

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email.split('@')[0] ?? 'Пользователь'
        }
      }
    })
  ]
}
