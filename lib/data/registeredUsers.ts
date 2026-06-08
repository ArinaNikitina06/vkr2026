import { normalizeUserName } from '../userDisplay'
import { readLocalStorageValue, writeLocalStorageValue } from '../storage'

const registeredUsersStorageKey = 'eduflow.registeredUsers'

type RegisteredUser = {
  email: string
  name: string
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isRegisteredUser(value: unknown): value is RegisteredUser {
  if (!value || typeof value !== 'object') {
    return false
  }

  const user = value as Partial<RegisteredUser>

  return typeof user.email === 'string' && typeof user.name === 'string'
}

function readRegisteredUsers(): RegisteredUser[] {
  const parsedUsers = readLocalStorageValue<RegisteredUser[] | unknown>(registeredUsersStorageKey, [])

  return Array.isArray(parsedUsers) ? parsedUsers.filter(isRegisteredUser) : []
}

function saveRegisteredUsers(users: RegisteredUser[]): void {
  writeLocalStorageValue(registeredUsersStorageKey, users)
}

export function getRegisteredUser(email: string): RegisteredUser | undefined {
  const safeEmail = normalizeEmail(email)

  return readRegisteredUsers().find((user) => user.email === safeEmail)
}

export function saveRegisteredUser(email: string, name: string): void {
  const safeEmail = normalizeEmail(email)
  const safeName = normalizeUserName(name) ?? safeEmail.split('@')[0] ?? 'Пользователь'
  const users = readRegisteredUsers().filter((user) => user.email !== safeEmail)

  saveRegisteredUsers([...users, { email: safeEmail, name: safeName }])
}
