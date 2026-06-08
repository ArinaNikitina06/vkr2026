export function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function getSafeRelativePath(value: string | string[] | undefined, fallback = '/'): string {
  const queryValue = getQueryValue(value)

  if (!queryValue || queryValue.startsWith('http')) {
    return fallback
  }

  return queryValue.startsWith('/') ? queryValue : fallback
}

export function parseCommaSeparatedList(value: string | string[] | undefined): string[] {
  const rawValue = getQueryValue(value)

  if (!rawValue) {
    return []
  }

  return rawValue.split(',').map((item) => item.trim()).filter(Boolean)
}

