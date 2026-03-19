import {
  type StorageTtlHours,
  STORAGE_TTL_HOURS_OPTIONS,
} from '@/constants/upload'

const TTL_HOURS_SET = new Set<number>(STORAGE_TTL_HOURS_OPTIONS)

export function parseStorageTtlHours(value: unknown): StorageTtlHours | null {
  if (typeof value !== 'string') return null

  const ttlHours = Number.parseInt(value, 10)
  if (!Number.isInteger(ttlHours)) return null

  return TTL_HOURS_SET.has(ttlHours) ? (ttlHours as StorageTtlHours) : null
}

