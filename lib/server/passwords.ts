import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const passwordKeyLength = 64

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, passwordKeyLength).toString('hex')

  return `${salt}:${hash}`
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, storedHash] = passwordHash.split(':')

  if (!salt || !storedHash) {
    return false
  }

  const hash = scryptSync(password, salt, passwordKeyLength)
  const storedHashBuffer = Buffer.from(storedHash, 'hex')

  if (hash.length !== storedHashBuffer.length) {
    return false
  }

  return timingSafeEqual(hash, storedHashBuffer)
}

