import { useRouter } from 'next/router'

export function useRouteParam(name: string): string | null {
  const router = useRouter()
  const value = router.query[name]

  if (!router.isReady) {
    return null
  }

  return Array.isArray(value) ? value[0] ?? null : value ?? null
}
