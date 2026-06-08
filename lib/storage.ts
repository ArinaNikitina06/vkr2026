export function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function readLocalStorageValue<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) {
    return fallback
  }

  try {
    const savedValue = window.localStorage.getItem(key)

    return savedValue ? JSON.parse(savedValue) as T : fallback
  } catch {
    return fallback
  }
}

export function writeLocalStorageValue<T>(key: string, value: T): void {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function readLocalStorageText(key: string): string | null {
  if (!canUseLocalStorage()) {
    return null
  }

  return window.localStorage.getItem(key)
}

export function writeLocalStorageText(key: string, value: string): void {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(key, value)
}

export function removeLocalStorageValue(key: string): void {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.removeItem(key)
}

