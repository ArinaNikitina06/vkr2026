import { useCallback, useMemo } from 'react'
import {
  readLocalStorageValue,
  removeLocalStorageValue,
  writeLocalStorageValue
} from '../lib/storage'

export function useLocalStorage<T>(key: string, fallback: T) {
  const read = useCallback(() => readLocalStorageValue<T>(key, fallback), [fallback, key])
  const save = useCallback((value: T) => writeLocalStorageValue(key, value), [key])
  const remove = useCallback(() => removeLocalStorageValue(key), [key])

  return useMemo(() => ({
    read,
    save,
    remove
  }), [read, remove, save])
}
