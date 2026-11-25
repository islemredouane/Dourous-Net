const OFFLINE_TTL_MS = 60_000
const PROBE_TIMEOUT_MS = 600

interface SupabaseHealthCache {
  offline: boolean
  checkedAt: number
  inFlight: Promise<boolean> | null
}

const globalForHealth = globalThis as typeof globalThis & {
  __dourousSupabaseHealth?: SupabaseHealthCache
}

function getCache(): SupabaseHealthCache {
  if (!globalForHealth.__dourousSupabaseHealth) {
    globalForHealth.__dourousSupabaseHealth = {
      offline: false,
      checkedAt: 0,
      inFlight: null,
    }
  }
  return globalForHealth.__dourousSupabaseHealth
}

export function markSupabaseOffline() {
  const cache = getCache()
  cache.offline = true
  cache.checkedAt = Date.now()
}

export function isSupabaseOfflineCached(): boolean {
  const cache = getCache()
  return cache.offline && Date.now() - cache.checkedAt < OFFLINE_TTL_MS
}

export async function isSupabaseOffline(): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return true

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return true

  const cache = getCache()
  if (cache.checkedAt > 0 && Date.now() - cache.checkedAt < OFFLINE_TTL_MS) {
    return cache.offline
  }

  if (cache.inFlight) return cache.inFlight

  cache.inFlight = (async () => {
    try {
      await fetch(`${url}/rest/v1/`, {
        method: 'HEAD',
        headers: { apikey: key },
        signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
        cache: 'no-store',
      })
      cache.offline = false
    } catch {
      cache.offline = true
    } finally {
      cache.checkedAt = Date.now()
      cache.inFlight = null
    }
    return cache.offline
  })()

  return cache.inFlight
}
