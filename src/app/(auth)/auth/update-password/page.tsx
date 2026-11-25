'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setError('Invalid or expired reset link. Please request a new one.')
        else setReady(true)
      })
    } else {
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
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { label: 'Fair', color: 'bg-amber-500', width: 'w-3/4' }
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' }
  })()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2200)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1120] px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-7 space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#2563EB]/15">
              <KeyRound className="h-5 w-5 text-[#AEC6FF]" />
            </div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Set New Password
            </h1>
            <p className="mt-2 text-xs text-[#94A3B8]">
              Choose a strong password for your Dourous-Net account.
            </p>
          </div>

          {done ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-8 text-center">
              <CheckCircle className="h-9 w-9 text-emerald-400" />
              <p className="font-semibold text-emerald-300">Password updated!</p>
              <p className="text-xs text-[#94A3B8]">Redirecting to your dashboard…</p>
            </div>
          ) : error && !ready ? (
            <div className="space-y-4 text-center">
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-xs text-red-400">
                {error}
              </div>
              <Link
                href="/auth/forgot-password"
                className="font-mono text-xs text-[#AEC6FF] hover:text-white transition-colors"
              >
                Request a new reset link →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="eyebrow text-[#8A94A8]">New Password</Label>
                <div className="relative">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    disabled={!ready}
                    className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A94A8] hover:text-white"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {strength && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1 w-full rounded-full overflow-hidden bg-[#080E1D]">
                      <div className={`h-1 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>
                    <p className="font-mono text-[10px] text-[#8A94A8]">{strength.label}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="eyebrow text-[#8A94A8]">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    disabled={!ready}
                    className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A94A8] hover:text-white"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              {error && ready && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !ready || !password || !confirm}
                className="flex w-full h-11 items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
