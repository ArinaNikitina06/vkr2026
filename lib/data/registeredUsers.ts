import { normalizeUserName } from '../userDisplay'

const registeredUsersStorageKey = 'eduflow.registeredUsers'

type RegisteredUser = {
  email: string
  name: string
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function readRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') {
    return []
  }

  const savedUsers = window.localStorage.getItem(registeredUsersStorageKey)

  if (!savedUsers) {
    return []
  }

  try {
    const parsedUsers = JSON.parse(savedUsers)

    return Array.isArray(parsedUsers) ? parsedUsers : []
  } catch {
    return []
  }
}

function saveRegisteredUsers(users: RegisteredUser[]): void {
  window.localStorage.setItem(registeredUsersStorageKey, JSON.stringify(users))
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
