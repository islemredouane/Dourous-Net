import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // If there was an OAuth error, redirect to auth with the error
  if (error) {
    console.error('[Auth Callback] OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('[Auth Callback] Code exchange failed:', exchangeError.message)
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(exchangeError.message)}`)
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('[Auth Callback] Get user failed:', userError?.message)
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('Failed to get user after sign in')}`)
    }

    // Check if student profile exists
    let { data: profile } = await supabase
      .from('students')
      .select('onboarded')
      .eq('id', user.id)
      .single()

    // Fallback: If profile doesn't exist (e.g. Supabase trigger failed/missing), create it!
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('students')
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
        })
        .select('onboarded')
        .single()

      if (insertError) {
        console.error('[Auth Callback] Failed to create student profile:', insertError.message)
      } else {
        profile = newProfile
      }
    }

    if (!profile?.onboarded) {
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // No code present
  console.error('[Auth Callback] No code parameter found in callback URL')
  return NextResponse.redirect(`${origin}/auth`)
}
