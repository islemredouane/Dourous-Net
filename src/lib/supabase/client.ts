'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import {
  createDemoSupabaseClient,
  readBrowserDemoRole,
} from '@/lib/demo/mock-client'

export function createClient() {
  const demoRole = readBrowserDemoRole()
  const isOfflineDemo =
    process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
    (typeof document !== 'undefined' &&
      document.cookie.includes('dourous_supabase_offline=1'))

  if (demoRole || isOfflineDemo) {
    return createDemoSupabaseClient({ role: demoRole, isBrowser: true })
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
