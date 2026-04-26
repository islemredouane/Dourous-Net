import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/teacher', '/profile', '/onboarding']
const TEACHER_ONLY = ['/teacher']

export async function proxy(request: NextRequest) {
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

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isProtected = PROTECTED.some((r) => pathname.startsWith(r))

  // Redirect unauthenticated users away from protected routes
  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // For authenticated users on protected routes (except /onboarding itself)
  if (user && isProtected && !pathname.startsWith('/onboarding')) {
    const { data: profile } = await supabase
      .from('students')
      .select('onboarded, role')
      .eq('id', user.id)
      .single()

    // Send to onboarding if not yet completed
    if (profile && !profile.onboarded) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Block non-teachers from teacher-only routes
    if (profile?.role !== 'teacher' && TEACHER_ONLY.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
