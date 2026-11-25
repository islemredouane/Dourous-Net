import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import {
  DEMO_ACCOUNTS,
  type DemoDatabase,
  type DemoRole,
} from './seed'
import {
  applyMutationToDb,
  getBrowserDemoDb,
  getServerDemoDb,
  saveBrowserDemoDb,
} from './store'

type TableName = keyof Omit<DemoDatabase, 'version' | 'createdAt'>

interface DemoAuthUser {
  id: string
  email: string
  user_metadata: { full_name: string }
}

function getDemoUser(role: DemoRole | null): DemoAuthUser | null {
  if (role === 'student') {
    const a = DEMO_ACCOUNTS.student
    return { id: a.id, email: a.email, user_metadata: { full_name: a.full_name } }
  }
  if (role === 'teacher') {
    const a = DEMO_ACCOUNTS.teacher
    return { id: a.id, email: a.email, user_metadata: { full_name: a.full_name } }
  }
  return null
}

function hydrateRelations(
  row: Record<string, unknown>,
  selectExpr: string,
  db: DemoDatabase,
): Record<string, unknown> {
  const enriched: Record<string, unknown> = { ...row }

  if (selectExpr.includes('teacher:students')) {
    const teacher =
      db.students.find((s) => s.id === row.teacher_id) ?? null
    enriched.teacher = teacher
  }

  if (selectExpr.includes('student:students')) {
    const student =
      db.students.find((s) => s.id === row.student_id) ?? null
    enriched.student = student
  }

  if (selectExpr.includes('session:sessions')) {
    const sessionRow =
      db.sessions.find((s) => s.id === row.session_id) ?? null
    if (sessionRow) {
      const withTeacher: Record<string, unknown> = { ...sessionRow }
      if (selectExpr.includes('teacher:students')) {
        withTeacher.teacher =
          db.students.find((st) => st.id === sessionRow.teacher_id) ?? null
      }
      enriched.session = withTeacher
    } else {
      enriched.session = null
    }
  }

  return enriched
}

function parseOrClause(row: Record<string, unknown>, orExpr: string): boolean {
  const parts = orExpr.split(',')
  return parts.some((part) => {
    const match = part.trim().match(/^([^.]+)\.ilike\.%(.*)%$/i)
    if (!match) return false
    const [, col, term] = match
    const val = row[col]
    return typeof val === 'string' && val.toLowerCase().includes(term.toLowerCase())
  })
}

export interface DemoClientOptions {
  role: DemoRole | null
  sessionId?: string
  isBrowser?: boolean
}

export function readBrowserDemoRole(): DemoRole | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)dourous_demo_role=([^;]+)/)
  const val = match ? decodeURIComponent(match[1]) : null
  return val === 'student' || val === 'teacher' ? val : null
}

function setBrowserDemoRoleCookie(role: DemoRole | null) {
  if (typeof document === 'undefined') return
  if (role) {
    document.cookie = `dourous_demo_role=${role}; path=/; max-age=86400; SameSite=Lax`
  } else {
    document.cookie = 'dourous_demo_role=; path=/; max-age=0; SameSite=Lax'
  }
  window.dispatchEvent(new CustomEvent('dourous-demo-auth', { detail: { role } }))
}

export function createDemoSupabaseClient(
  options: DemoClientOptions,
): SupabaseClient<Database> {
  const isBrowser = Boolean(options.isBrowser)
  const sessionId = options.sessionId ?? 'default'

  const getDb = (): DemoDatabase =>
    isBrowser ? getBrowserDemoDb() : getServerDemoDb(sessionId)

  const syncMutationToServer = async (payload: {
    table: TableName
    action: 'insert' | 'update' | 'upsert' | 'delete'
    payload: Record<string, unknown> | Record<string, unknown>[] | null
    filters: Array<{ kind: 'eq' | 'in' | 'not'; column: string; value: unknown }>
    upsertOptions?: { onConflict?: string }
  }) => {
    if (!isBrowser || typeof fetch === 'undefined') return
    try {
      await fetch('/api/demo/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op: 'mutate', ...payload }),
      })
    } catch {
      // keep localStorage state even if fetch fails
    }
  }

  const uploadedUrls = new Map<string, string>()

  const buildQuery = (table: TableName) => {
    let operation: 'select' | 'insert' | 'update' | 'upsert' | 'delete' = 'select'
    let selectExpr = '*'
    let countMode = false
    let headOnly = false
    let mutationPayload: Record<string, unknown> | Record<string, unknown>[] | null = null
    let upsertOpts: { onConflict?: string } | undefined
    const filters: Array<{
      kind: 'eq' | 'in' | 'not' | 'ilike' | 'or'
      column: string
      value: unknown
    }> = []
    let orderBy: { column: string; ascending: boolean } | null = null
    let limitCount: number | null = null
    let mode: 'many' | 'single' | 'maybeSingle' = 'many'

    const execute = async (): Promise<{
      data: unknown
      error: { message: string } | null
      count: number | null
    }> => {
      const db = getDb()

      if (operation !== 'select') {
        const simpleFilters = filters.filter(
          (f): f is { kind: 'eq' | 'in' | 'not'; column: string; value: unknown } =>
            f.kind === 'eq' || f.kind === 'in' || f.kind === 'not',
        )
        const affected = applyMutationToDb(
          db,
          table,
          operation,
          mutationPayload,
          simpleFilters,
          upsertOpts,
        )
        if (isBrowser) {
          saveBrowserDemoDb(db)
          await syncMutationToServer({
            table,
            action: operation,
            payload: mutationPayload,
            filters: simpleFilters,
            upsertOptions: upsertOpts,
          })
          window.dispatchEvent(new CustomEvent('dourous-demo-change'))
        }

        const hydrated = affected.map((r) => hydrateRelations(r, selectExpr, db))
        if (mode === 'single') {
          return { data: hydrated[0] ?? null, error: null, count: hydrated.length }
        }
        if (mode === 'maybeSingle') {
          return { data: hydrated[0] ?? null, error: null, count: hydrated.length }
        }
        return { data: hydrated, error: null, count: hydrated.length }
      }

      const rawRows = (db[table] as unknown as Record<string, unknown>[]) ?? []
      let rows = rawRows.filter((row) =>
        filters.every((f) => {
          const val = row[f.column]
          if (f.kind === 'eq') return val === f.value
          if (f.kind === 'in' && Array.isArray(f.value)) return f.value.includes(val)
          if (f.kind === 'not') {
            return f.value === null ? val !== null && val !== undefined : val !== f.value
          }
          if (f.kind === 'ilike' && typeof f.value === 'string') {
            const needle = f.value.replace(/%/g, '').toLowerCase()
            return typeof val === 'string' && val.toLowerCase().includes(needle)
          }
          if (f.kind === 'or' && typeof f.value === 'string') {
            return parseOrClause(row, f.value)
          }
          return true
        }),
      )

      const totalCount = rows.length

      if (orderBy) {
        const { column, ascending } = orderBy
        rows = [...rows].sort((a, b) => {
          const av = a[column]
          const bv = b[column]
          if (av === bv) return 0
          if (av === undefined || av === null) return 1
          if (bv === undefined || bv === null) return -1
          if (typeof av === 'number' && typeof bv === 'number') {
            return ascending ? av - bv : bv - av
          }
          return ascending
            ? String(av).localeCompare(String(bv))
            : String(bv).localeCompare(String(av))
        })
      }

      if (limitCount !== null) {
        rows = rows.slice(0, limitCount)
      }

      if (headOnly) {
        return { data: null, error: null, count: countMode ? totalCount : null }
      }

      const hydrated = rows.map((r) => hydrateRelations(r, selectExpr, db))
      if (mode === 'single') {
        return {
          data: hydrated[0] ?? null,
          error: hydrated[0] ? null : { message: 'Row not found' },
          count: countMode ? totalCount : null,
        }
      }
      if (mode === 'maybeSingle') {
        return {
          data: hydrated[0] ?? null,
          error: null,
          count: countMode ? totalCount : null,
        }
      }
      return {
        data: hydrated,
        error: null,
        count: countMode ? totalCount : null,
      }
    }

    const builder = {
      select(cols = '*', opts?: { count?: 'exact'; head?: boolean }) {
        selectExpr = cols
        countMode = opts?.count === 'exact'
        headOnly = Boolean(opts?.head)
        return builder
      },
      insert(payload: Record<string, unknown> | Record<string, unknown>[]) {
        operation = 'insert'
        mutationPayload = payload
        return builder
      },
      update(payload: Record<string, unknown>) {
        operation = 'update'
        mutationPayload = payload
        return builder
      },
      upsert(
        payload: Record<string, unknown> | Record<string, unknown>[],
        opts?: { onConflict?: string },
      ) {
        operation = 'upsert'
        mutationPayload = payload
        upsertOpts = opts
        return builder
      },
      delete() {
        operation = 'delete'
        return builder
      },
      eq(column: string, value: unknown) {
        filters.push({ kind: 'eq', column, value })
        return builder
      },
      in(column: string, value: unknown[]) {
        filters.push({ kind: 'in', column, value })
        return builder
      },
      not(column: string, _op: string, value: unknown) {
        filters.push({ kind: 'not', column, value })
        return builder
      },
      ilike(column: string, value: string) {
        filters.push({ kind: 'ilike', column, value })
        return builder
      },
      or(expr: string) {
        filters.push({ kind: 'or', column: '', value: expr })
        return builder
      },
      order(column: string, opts?: { ascending?: boolean }) {
        orderBy = { column, ascending: opts?.ascending ?? true }
        return builder
      },
      limit(n: number) {
        limitCount = n
        return builder
      },
      single() {
        mode = 'single'
        return builder
      },
      maybeSingle() {
        mode = 'maybeSingle'
        return builder
      },
      then<TResult1 = unknown, TResult2 = never>(
        onfulfilled?: ((value: { data: unknown; error: { message: string } | null; count: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
      ) {
        return execute().then(onfulfilled, onrejected)
      },
    }

    return builder
  }

  const currentRole = (): DemoRole | null =>
    isBrowser ? readBrowserDemoRole() ?? options.role : options.role

  const auth = {
    async getUser() {
      const user = getDemoUser(currentRole())
      return { data: { user }, error: null }
    },
    async getSession() {
      const user = getDemoUser(currentRole())
      return {
        data: {
          session: user ? { user, access_token: `demo-${currentRole()}` } : null,
        },
        error: null,
      }
    },
    onAuthStateChange(
      callback: (event: string, session: { user: DemoAuthUser } | null) => void,
    ) {
      if (!isBrowser) {
        return { data: { subscription: { unsubscribe: () => {} } } }
      }
      const handler = () => {
        const user = getDemoUser(readBrowserDemoRole())
        callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null)
      }
      window.addEventListener('dourous-demo-auth', handler)
      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener('dourous-demo-auth', handler),
          },
        },
      }
    },
    async signInWithPassword({ email }: { email: string }) {
      const normalized = email.trim().toLowerCase()
      const role: DemoRole = normalized.includes('ahmed') || normalized.includes('teacher')
        ? 'teacher'
        : 'student'
      if (isBrowser) {
        setBrowserDemoRoleCookie(role)
        await fetch('/api/demo/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op: 'switchRole', role }),
        }).catch(() => {})
      }
      return { data: { user: getDemoUser(role) }, error: null }
    },
    async signUp({ email, options: signUpOpts }: { email: string; options?: { data?: { full_name?: string } } }) {
      if (isBrowser) {
        setBrowserDemoRoleCookie('student')
        await fetch('/api/demo/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op: 'switchRole', role: 'student' }),
        }).catch(() => {})
      }
      return {
        data: {
          user: {
            id: DEMO_ACCOUNTS.student.id,
            email,
            user_metadata: { full_name: signUpOpts?.data?.full_name ?? 'Demo Learner' },
          },
        },
        error: null,
      }
    },
    async signInWithOAuth() {
      if (isBrowser) {
        setBrowserDemoRoleCookie('student')
        await fetch('/api/demo/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op: 'switchRole', role: 'student' }),
        }).catch(() => {})
        window.location.href = '/dashboard'
      }
      return { data: { url: '/dashboard' }, error: null }
    },
    async resetPasswordForEmail() {
      return { data: {}, error: null }
    },
    async exchangeCodeForSession() {
      return { data: { session: null }, error: null }
    },
    async updateUser() {
      return { data: { user: getDemoUser(currentRole()) }, error: null }
    },
    async signOut() {
      if (isBrowser) {
        setBrowserDemoRoleCookie(null)
        await fetch('/api/demo/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op: 'switchRole', role: 'guest' }),
        }).catch(() => {})
      }
      return { error: null }
    },
  }

  const storage = {
    from(bucket: string) {
      return {
        async upload(path: string, file: File) {
          const key = `${bucket}/${path}`
          if (bucket === 'submissions') {
            uploadedUrls.set(
              key,
              `/api/demo/sample-submission?course=${encodeURIComponent(file?.name || 'Submission.pdf')}`,
            )
            return { data: { path }, error: null }
          }
          if (isBrowser && file && file.type.startsWith('image/') && file.size <= 350_000) {
            try {
              const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = () => resolve(String(reader.result || ''))
                reader.onerror = () => resolve('')
                reader.readAsDataURL(file)
              })
              if (dataUrl) uploadedUrls.set(key, dataUrl)
            } catch {
              // fallback cleanly
            }
          }
          return { data: { path }, error: null }
        },
        getPublicUrl(path: string) {
          const key = `${bucket}/${path}`
          const stored = uploadedUrls.get(key)
          if (stored) return { data: { publicUrl: stored } }
          if (bucket === 'submissions') {
            return {
              data: {
                publicUrl: `/api/demo/sample-submission?course=${encodeURIComponent(path)}`,
              },
            }
          }
          return {
            data: { publicUrl: '/favicon.svg' },
          }
        },
      }
    },
  }

  return {
    from: (table: TableName) => buildQuery(table),
    auth,
    storage,
  } as unknown as SupabaseClient<Database>
}
