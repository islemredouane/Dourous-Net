'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/shared/GlassCard'
import { GradientText } from '@/components/shared/GradientText'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-md">
        <Link
          href="/auth"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>

        <GlassCard className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Mail className="h-6 w-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              <GradientText>Reset Password</GradientText>
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <p className="font-semibold text-green-400">Email sent!</p>
              <p className="text-sm text-slate-400">
                Check your inbox at <span className="text-white">{email}</span> for the reset link.
              </p>
              <Link href="/auth" className="mt-2 text-sm text-indigo-400 hover:text-indigo-300">
                Back to sign in →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
