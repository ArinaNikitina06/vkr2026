import { useCallback, useMemo } from 'react'

function readStringList(key: string): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

function saveStringList(key: string, value: string[]) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function useStringListStorage(key: string) {
  const read = useCallback(() => readStringList(key), [key])
  const save = useCallback((value: string[]) => saveStringList(key, value), [key])

  return useMemo(() => ({
    read,
    save
  }), [read, save])
}
