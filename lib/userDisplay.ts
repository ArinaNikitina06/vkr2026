const invalidUserNames = new Set(['undefined', 'null'])

export function normalizeUserName(name?: string | null): string | undefined {
  const normalizedName = name?.trim()

  if (!normalizedName || invalidUserNames.has(normalizedName.toLowerCase())) {
    return undefined
  }

  return normalizedName
}

export function getUserDisplayName(name?: string | null, email?: string | null): string {
  const normalizedName = normalizeUserName(name)

  if (normalizedName) {
    return normalizedName
  }

  return email?.split('@')[0] || 'Пользователь'
}
