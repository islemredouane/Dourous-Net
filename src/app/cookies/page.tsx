import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Cookie } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy — Dourous-Net',
  description: 'Understand how Dourous-Net uses cookies and similar technologies.',
}

const cookieTypes = [
  {
    name: 'Strictly Necessary',
    badge: 'Always Active',
    badgeColor: 'bg-green-500/10 border-green-500/20 text-green-400',
    description: 'These cookies are essential for the Platform to function. They enable core features like user authentication, session management, and security. Without them, the Platform cannot operate.',
    examples: [
      { name: 'sb-access-token', purpose: 'Authenticates your session with Supabase' },
      { name: 'sb-refresh-token', purpose: 'Keeps you logged in between visits' },
      { name: '__Host-next-auth', purpose: 'Manages Next.js authentication state' },
    ],
  },
  {
    name: 'Functional',
    badge: 'Optional',
    badgeColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    description: 'These cookies remember your preferences and personalize your experience — such as your preferred language, last visited lesson, or UI settings.',
    examples: [
      { name: 'dourous-theme', purpose: 'Stores your display preference' },
      { name: 'dourous-last-session', purpose: 'Remembers your last open course for quick resume' },
    ],
  },
  {
    name: 'Analytics',
    badge: 'Optional',
    badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    description: 'These cookies help us understand how users interact with the Platform. The data is aggregated and anonymous — we use it to improve performance, identify broken flows, and prioritize new features.',
    examples: [
      { name: '_vercel_analytics', purpose: 'Collects anonymous page view data via Vercel Analytics' },
    ],
  },
  {
    name: 'Third-Party',
    badge: 'External',
    badgeColor: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    description: 'When you watch a YouTube video embedded in a lesson, YouTube may set cookies on your device. These are governed by Google\'s Privacy Policy. We have no control over these cookies.',
    examples: [
      { name: 'VISITOR_INFO1_LIVE', purpose: 'Set by YouTube to track video playback preferences' },
      { name: 'YSC', purpose: 'Set by YouTube for session tracking during video playback' },
    ],
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: '#030712', fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Cookie className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-400">Transparency first</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: May 2026</p>
        </div>

        <p className="mb-10 text-slate-400 leading-relaxed">
          Dourous-Net uses cookies and similar technologies to keep you signed in, remember your preferences, and improve the Platform. This page explains exactly what cookies we use and why.
        </p>

        <div className="space-y-8">
          {cookieTypes.map((type) => (
            <div key={type.name} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h2 className="font-semibold text-white">{type.name} Cookies</h2>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${type.badgeColor}`}>
                  {type.badge}
                </span>
              </div>

              {/* Description */}
              <div className="px-6 py-4 border-b border-white/[0.04]">
                <p className="text-sm text-slate-400 leading-relaxed">{type.description}</p>
              </div>

              {/* Cookie table */}
              <div className="divide-y divide-white/[0.04]">
                {type.examples.map((cookie) => (
                  <div key={cookie.name} className="flex items-start gap-4 px-6 py-3">
                    <code className="mt-0.5 shrink-0 rounded-md bg-white/5 border border-white/[0.08] px-2 py-0.5 text-xs text-indigo-300 font-mono">
                      {cookie.name}
                    </code>
                    <p className="text-sm text-slate-500">{cookie.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Managing cookies */}
        <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-3 font-semibold text-white">Managing Your Cookie Preferences</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            You can control non-essential cookies through your browser settings. Most browsers allow you to refuse or delete cookies. Note that disabling strictly necessary cookies will prevent you from signing in or using the Platform.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            {['Chrome', 'Firefox', 'Safari', 'Edge'].map((browser) => (
              <div key={browser} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-center text-slate-400">
                {browser}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Refer to your browser&apos;s help documentation for cookie management instructions.
          </p>
        </div>

        <div className="mt-8 flex gap-4 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service →</Link>
          <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy →</Link>
        </div>
      </div>
    </div>
  )
}
