'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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
    if (err) setError(err.message)
    else setSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1120] px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/auth"
          className="mb-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A94A8] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>

        <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-7 space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#2563EB]/15">
              <Mail className="h-5 w-5 text-[#AEC6FF]" />
            </div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Reset Password
            </h1>
            <p className="mt-2 text-xs text-[#94A3B8]">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <p className="text-sm font-semibold text-emerald-300">Reset email sent</p>
              <p className="text-xs text-[#94A3B8]">
                Check your inbox at <span className="text-white">{email}</span>.
              </p>
              <Link href="/auth" className="mt-2 font-mono text-xs text-[#AEC6FF] hover:text-white">
                Return to sign in →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="eyebrow text-[#8A94A8]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="flex w-full h-11 items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
