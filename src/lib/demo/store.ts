import {
  createSeedDatabase,
  DEMO_STATE_VERSION,
  type DemoDatabase,
} from './seed'

type DemoTableName = keyof Omit<DemoDatabase, 'version' | 'createdAt'>

const STORAGE_KEY = 'dourous_demo_state_v1'
const MAX_AGE_MS = 24 * 60 * 60 * 1000

const globalForDemo = globalThis as typeof globalThis & {
  __dourousServerDemoStores?: Map<string, DemoDatabase>
}

function getServerStoreMap(): Map<string, DemoDatabase> {
  if (!globalForDemo.__dourousServerDemoStores) {
    globalForDemo.__dourousServerDemoStores = new Map()
  }
  return globalForDemo.__dourousServerDemoStores
}

export function getServerDemoDb(sessionId = 'default'): DemoDatabase {
  const map = getServerStoreMap()
  const existing = map.get(sessionId)
  if (existing && existing.version === DEMO_STATE_VERSION && Date.now() - existing.createdAt < MAX_AGE_MS) {
    return existing
  }
  const fresh = createSeedDatabase()
  map.set(sessionId, fresh)
  return fresh
}

export function resetServerDemoDb(sessionId = 'default'): DemoDatabase {
  const fresh = createSeedDatabase()
  getServerStoreMap().set(sessionId, fresh)
  return fresh
}

export function getBrowserDemoDb(): DemoDatabase {
  if (typeof window === 'undefined') return createSeedDatabase()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoDatabase
      if (parsed.version === DEMO_STATE_VERSION && Date.now() - parsed.createdAt < MAX_AGE_MS) {
        return parsed
      }
    }
  } catch {
    // ignore storage access issues
  }
  const fresh = createSeedDatabase()
  saveBrowserDemoDb(fresh)
  return fresh
}

export function saveBrowserDemoDb(db: DemoDatabase): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // ignore quota exceeded
  }
}

export function resetBrowserDemoDb(): DemoDatabase {
  const fresh = createSeedDatabase()
  saveBrowserDemoDb(fresh)
  return fresh
}

export function applyMutationToDb(
  db: DemoDatabase,
  table: DemoTableName,
  action: 'insert' | 'update' | 'upsert' | 'delete',
  payload: Record<string, unknown> | Record<string, unknown>[] | null,
  filters: Array<{ kind: 'eq' | 'in' | 'not'; column: string; value: unknown }>,
  upsertOptions?: { onConflict?: string },
): Record<string, unknown>[] {
  const rows = db[table] as unknown as Record<string, unknown>[]
  const nowIso = new Date().toISOString()

  if (action === 'insert' && payload) {
    const list = Array.isArray(payload) ? payload : [payload]
    const created: Record<string, unknown>[] = []
    for (const item of list) {
      const record: Record<string, unknown> = {
        id: (item.id as string) || crypto.randomUUID(),
        created_at: (item.created_at as string) || nowIso,
        enrolled_at: (item.enrolled_at as string) || nowIso,
        updated_at: (item.updated_at as string) || nowIso,
        graded_at: (item.graded_at as string) || nowIso,
        ...item,
      }
      rows.push(record)
      created.push(record)
    }
    return created
  }

  if (action === 'upsert' && payload) {
    const list = Array.isArray(payload) ? payload : [payload]
    const conflictCols = (upsertOptions?.onConflict ?? 'id')
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    const result: Record<string, unknown>[] = []
    for (const item of list) {
      const matchIndex = rows.findIndex((r) =>
        conflictCols.every((col) => r[col] === item[col]),
      )
      if (matchIndex >= 0) {
        rows[matchIndex] = { ...rows[matchIndex], ...item, updated_at: nowIso }
        result.push(rows[matchIndex])
      } else {
        const record: Record<string, unknown> = {
          id: (item.id as string) || crypto.randomUUID(),
          created_at: (item.created_at as string) || nowIso,
          updated_at: nowIso,
          ...item,
        }
        rows.push(record)
        result.push(record)
      }
    }
    return result
  }

  const matchesFilters = (row: Record<string, unknown>) =>
    filters.every((f) => {
      const val = row[f.column]
      if (f.kind === 'eq') return val === f.value
      if (f.kind === 'in' && Array.isArray(f.value)) return f.value.includes(val)
      if (f.kind === 'not') {
        if (f.value === null) return val !== null && val !== undefined
        return val !== f.value
      }
      return true
    })

  if (action === 'update' && payload && !Array.isArray(payload)) {
    const updated: Record<string, unknown>[] = []
    for (let i = 0; i < rows.length; i++) {
      if (matchesFilters(rows[i])) {
        rows[i] = { ...rows[i], ...payload, updated_at: nowIso }
        updated.push(rows[i])
      }
    }
    return updated
  }

  if (action === 'delete') {
    const removed: Record<string, unknown>[] = []
    const remaining = rows.filter((r) => {
      if (matchesFilters(r)) {
        removed.push(r)
        return false
      }
      return true
    })
    ;(db[table] as unknown as Record<string, unknown>[]) = remaining
    return removed
  }

  return []
}
