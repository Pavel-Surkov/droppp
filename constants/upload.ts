export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024
export const MAX_FILES_COUNT = 10
export const STORAGE_TTL_HOURS_OPTIONS = [1, 6, 12, 24] as const

export type StorageTtlHours = (typeof STORAGE_TTL_HOURS_OPTIONS)[number]

export const DEFAULT_STORAGE_TTL_HOURS: StorageTtlHours = 1
export const DEFAULT_STORAGE_TTL_SECONDS = DEFAULT_STORAGE_TTL_HOURS * 60 * 60
