import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserDisplayName, normalizeUserName } from '../userDisplay'
import { createUser, getUserByEmail } from './userRepository'

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
        },
        mode: {
          label: 'Режим',
          type: 'text'
        }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()

        if (!email) {
          return null
        }

        const name = normalizeUserName(credentials?.name)
        const isRegisterMode = credentials?.mode === 'register'
        const existingUser = await getUserByEmail(email)
        const user = isRegisterMode
          ? existingUser ? null : await createUser(email, name)
          : existingUser

        if (!user) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: getUserDisplayName(user.name, user.email)
        }
      }
    })
  ]
}
