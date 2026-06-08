export const profileStorageKey = 'eduflow.profile'

export type UserProfile = {
  name: string
  bio: string
}

export const defaultUserProfile: UserProfile = {
  name: '',
  bio: ''
}

export function getProfileStorageKey(email?: string | null): string {
  return email ? `${profileStorageKey}.${email}` : profileStorageKey
}

