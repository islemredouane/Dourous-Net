import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  isSupabaseOffline,
  markSupabaseOffline,
} from '@/lib/supabase/reachability'

const PROTECTED = ['/dashboard', '/teacher', '/profile', '/onboarding']
const TEACHER_ONLY = ['/teacher']

function matchesRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = PROTECTED.some((r) => matchesRoutePrefix(pathname, r))

  // 1. Portfolio Demo Mode session cookie check (instant 0ms)
  const demoRole = request.cookies.get('dourous_demo_role')?.value
  if (demoRole === 'student' || demoRole === 'teacher') {
    if (
      demoRole !== 'teacher' &&
      TEACHER_ONLY.some((r) => matchesRoutePrefix(pathname, r))
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next({ request })
  }

  // 2. Fast offline/unreachable circuit breaker (cached 60s)
  if (await isSupabaseOffline()) {
    const res = isProtected
      ? NextResponse.redirect(new URL('/auth', request.url))
      : NextResponse.next({ request })
    res.cookies.set('dourous_supabase_offline', '1', {
      path: '/',
      maxAge: 60,
      httpOnly: false,
      sameSite: 'lax',
    })
    return res
  }

  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith('sb-'))

  if (!hasAuthCookie) {
    const res = isProtected
      ? NextResponse.redirect(new URL('/auth', request.url))
      : NextResponse.next({ request })
    if (request.cookies.get('dourous_supabase_offline')) {
      res.cookies.delete('dourous_supabase_offline')
    }
    return res
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  let user: { id: string } | null = null
  try {
    const authResult = await Promise.race([
      supabase.auth.getUser(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200)),
    ])
    if (!authResult || authResult.error?.name === 'AuthRetryableFetchError') {
      markSupabaseOffline()
      supabaseResponse.cookies.set('dourous_supabase_offline', '1', {
        path: '/',
        maxAge: 60,
        httpOnly: false,
        sameSite: 'lax',
      })
    } else {
      user = authResult.data?.user ?? null
    }
  } catch {
    markSupabaseOffline()
    user = null
  }

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (user && isProtected && !pathname.startsWith('/onboarding')) {
    try {
      const { data: profile } = await supabase
        .from('students')
        .select('onboarded, role')
        .eq('id', user.id)
        .single()

      if (profile && !profile.onboarded) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }

      if (
        profile?.role !== 'teacher' &&
        TEACHER_ONLY.some((r) => matchesRoutePrefix(pathname, r))
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      // Fail safely on transient DB lookup failures
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
