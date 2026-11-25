import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Cookie } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Understand how Dourous-Net uses essential authentication and preference cookies.',
}

const cookieTypes = [
  {
    name: 'Strictly Necessary',
    badge: 'Always Active',
    badgeColor: 'border-emerald-400/35 bg-emerald-500/15 text-emerald-300',
    description:
      'Essential for user authentication, session security, and route protection via Supabase SSR.',
    examples: [
      { name: 'sb-access-token', purpose: 'Authenticates your Supabase session' },
      { name: 'sb-refresh-token', purpose: 'Maintains active sign-in securely' },
    ],
  },
  {
    name: 'Functional & Third-Party',
    badge: 'Optional / External',
    badgeColor: 'border-[#3B82F6]/35 bg-[#2563EB]/15 text-[#AEC6FF]',
    description:
      'Supports video embed preferences (YouTube / Vimeo / Google Drive) inside course lessons.',
    examples: [
      { name: 'VISITOR_INFO1_LIVE', purpose: 'YouTube embedded player preferences' },
      { name: 'YSC', purpose: 'YouTube embedded playback session integrity' },
    ],
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-5">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#8A94A8] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        <div className="mb-10 border-b border-[#DDE3EC]/10 pb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E] px-3.5 py-1">
            <Cookie className="h-3.5 w-3.5 text-[#AEC6FF]" />
            <span className="eyebrow text-[#AEC6FF]">Transparency</span>
          </div>
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Cookie Policy
          </h1>
          <p className="mt-3 font-mono text-xs text-[#8A94A8]">Last updated: May 2026</p>
        </div>

        <div className="space-y-6">
          {cookieTypes.map((type) => (
            <div key={type.name} className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE3EC]/10 bg-[#0E1526]">
                <h2
                  className="font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {type.name} Cookies
                </h2>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${type.badgeColor}`}>
                  {type.badge}
                </span>
              </div>
              <div className="px-6 py-4 border-b border-[#DDE3EC]/8">
                <p className="text-sm text-[#94A3B8] leading-relaxed">{type.description}</p>
              </div>
              <div className="divide-y divide-[#DDE3EC]/8">
                {type.examples.map((cookie) => (
                  <div key={cookie.name} className="flex items-start gap-4 px-6 py-3">
                    <code className="mt-0.5 shrink-0 rounded-md bg-[#080E1D] border border-[#DDE3EC]/15 px-2 py-0.5 text-xs text-[#AEC6FF] font-mono">
                      {cookie.name}
                    </code>
                    <p className="text-sm text-[#94A3B8]">{cookie.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-6 text-xs font-mono text-[#AEC6FF]">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service →
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  )
}
