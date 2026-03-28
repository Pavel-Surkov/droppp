const LAST_SHARE_COOKIE_KEY = 'dropp_last_share'

const MAX_COOKIE_AGE_SECONDS = 60 * 60 * 24

export type LastShareCookieData = {
  code: string
  link: string
  pin: string
  expiresAt: string
  createdAt: string
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null

  const cookieString = document.cookie
  if (!cookieString) return null

  const chunks = cookieString.split('; ')
  const chunk = chunks.find((item) => item.startsWith(`${name}=`))
  if (!chunk) return null

  return chunk.slice(name.length + 1)
}

function isValidLastShareCookieData(value: unknown): value is LastShareCookieData {
  if (typeof value !== 'object' || !value) return false

  const candidate = value as Partial<LastShareCookieData>
  return (
    typeof candidate.code === 'string' &&
    typeof candidate.link === 'string' &&
    typeof candidate.pin === 'string' &&
    /^\d{4}$/.test(candidate.pin) &&
    typeof candidate.expiresAt === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

export function clearLastShareCookie(): void {
  if (typeof document === 'undefined') return

  document.cookie = `${LAST_SHARE_COOKIE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`
}

export function readLastShareCookie(): LastShareCookieData | null {
  const rawValue = getCookieValue(LAST_SHARE_COOKIE_KEY)
  if (!rawValue) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue)) as unknown
    if (!isValidLastShareCookieData(parsed)) {
      clearLastShareCookie()
      return null
    }

    return parsed
  } catch {
    clearLastShareCookie()
    return null
  }
}

export function saveLastShareCookie(data: LastShareCookieData): void {
  if (typeof document === 'undefined') return

  const expiresAtTimestamp = new Date(data.expiresAt).getTime()
  const nowTimestamp = Date.now()
  if (!Number.isFinite(expiresAtTimestamp) || expiresAtTimestamp <= nowTimestamp) {
    clearLastShareCookie()
    return
  }

  const maxAgeSeconds = Math.min(
    Math.floor((expiresAtTimestamp - nowTimestamp) / 1000),
    MAX_COOKIE_AGE_SECONDS,
  )
  if (maxAgeSeconds <= 0) {
    clearLastShareCookie()
    return
  }

  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const secureChunk = secure ? '; Secure' : ''
  const encoded = encodeURIComponent(JSON.stringify(data))

  document.cookie =
    `${LAST_SHARE_COOKIE_KEY}=${encoded}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secureChunk}`
}

