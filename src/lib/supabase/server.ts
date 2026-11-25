import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { isSupabaseOffline } from './reachability'
import { createDemoSupabaseClient } from '@/lib/demo/mock-client'

export async function createClient() {
  const cookieStore = await cookies()
  const roleCookie = cookieStore.get('dourous_demo_role')?.value
  const demoRole =
    roleCookie === 'student' || roleCookie === 'teacher' ? roleCookie : null
  const demoSid = cookieStore.get('dourous_demo_sid')?.value ?? 'default'

  if (demoRole) {
    return createDemoSupabaseClient({ role: demoRole, sessionId: demoSid })
  }

  if (await isSupabaseOffline()) {
    return createDemoSupabaseClient({ role: null, sessionId: demoSid })
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll called from a Server Component — cookies will be set by the proxy
          }
        },
      },
    },
  )
}
