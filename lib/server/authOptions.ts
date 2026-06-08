import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserDisplayName, normalizeUserName } from '../userDisplay'
import { hashPassword, verifyPassword } from './passwords'
import { createUser, getUserByEmail, setUserPassword } from './userRepository'

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
        const password = credentials?.password?.trim()

        if (!email || !password) {
          return null
        }

        const name = normalizeUserName(credentials?.name)
        const isRegisterMode = credentials?.mode === 'register'

        try {
          const existingUser = await getUserByEmail(email)
          const user = isRegisterMode
            ? existingUser
              ? existingUser.passwordHash
                ? null
                : await setUserPassword(existingUser.id, hashPassword(password), name)
              : await createUser(email, name, hashPassword(password))
            : existingUser

          if (!user || (!isRegisterMode && (!user.passwordHash || !verifyPassword(password, user.passwordHash)))) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: getUserDisplayName(user.name, user.email)
          }
        } catch {
          return null
        }
      }
    })
  ]
}
