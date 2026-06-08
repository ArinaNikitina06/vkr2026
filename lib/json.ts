export function parseJsonArray<T>(value: string | null | undefined, fallback: T[]): T[] {
  if (!value) {
    return fallback
  }

  try {
    const parsedValue = JSON.parse(value)

    return Array.isArray(parsedValue) ? parsedValue as T[] : fallback
  } catch {
    return fallback
  }
}

