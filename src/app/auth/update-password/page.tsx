'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientText } from '@/components/shared/GradientText'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [showPw, setShowPw]           = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [done, setDone]               = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [ready, setReady]             = useState(false)

  // Exchange the code from the URL for a session
  useEffect(() => {
    const supabase = createClient()
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setError('Invalid or expired reset link. Please request a new one.')
        else setReady(true)
      })
    } else {
      // might be hash-based (older flow) — check if session already exists
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true)
        else setError('Invalid or expired reset link. Please request a new one.')
      })
    }
  }, [])

  const strength = (() => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: 'Too short', color: 'bg-red-500', width: 'w-1/4' }
    if (password.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: 'w-2/4' }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-3/4' }
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' }
  })()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) { setError(updateError.message); return }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-16 pt-20">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f1e] p-8 space-y-6">

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <KeyRound className="h-6 w-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              <GradientText>New Password</GradientText>
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Choose a strong password for your account.
            </p>
          </div>

          {/* Success state */}
          {done ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-8 text-center">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
              <p className="font-semibold text-emerald-400">Password updated!</p>
              <p className="text-sm text-slate-400">Redirecting you to your dashboard…</p>
            </div>
          ) : error && !ready ? (
            /* Invalid link state */
            <div className="space-y-4 text-center">
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-400">
                {error}
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Request a new reset link →
              </Link>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New password */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    disabled={!ready}
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Strength bar */}
                {strength && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1 w-full rounded-full bg-white/[0.06]">
                      <div className={`h-1 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>
                    <p className={`text-xs ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    disabled={!ready}
                    className={`bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl h-11 pr-10 transition-colors ${
                      confirm && confirm !== password ? 'border-red-500/50' : confirm && confirm === password ? 'border-emerald-500/50' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              {/* Error */}
              {error && ready && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !ready || !password || !confirm}
                className="w-full h-11 bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl font-medium shadow-glow-sm"
              >
                {loading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating…</>
                  : 'Update Password'
                }
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remembered your password?{' '}
          <Link href="/auth" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
