import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Dourous-Net collects, uses, and protects your personal data.',
}

const sections = [
  {
    title: 'Information We Collect',
    items: [
      { label: 'Account Information', text: 'Full name, email address, role, and profile details you provide during registration and onboarding.' },
      { label: 'Usage Data', text: 'Lessons completed, quiz scores, and course enrollment progress.' },
      { label: 'Submitted Content', text: 'PDF assignments and files uploaded to private cloud storage linked to your account.' },
    ],
  },
  {
    title: 'Data Storage & Security',
    items: [
      { label: 'Infrastructure', text: 'Data is hosted on Supabase (PostgreSQL) and served via Vercel over encrypted HTTPS/TLS.' },
      { label: 'Row-Level Security', text: 'PostgreSQL RLS policies enforce database-level isolation between student accounts and instructor sessions.' },
    ],
  },
  {
    title: 'Third-Party Services',
    items: [
      { label: 'Google OAuth', text: 'When signing in with Google, we receive only your basic identity profile and email.' },
      { label: 'Groq AI Coach', text: 'Lesson prompts send course context only; no personal student credentials are transmitted.' },
      { label: 'Embedded Video', text: 'YouTube, Vimeo, and Google Drive players adhere to their respective provider privacy terms.' },
    ],
  },
]

export default function PrivacyPage() {
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#2563EB]/15 px-3.5 py-1">
            <Shield className="h-3.5 w-3.5 text-[#AEC6FF]" />
            <span className="eyebrow text-[#AEC6FF]">Data Protection</span>
          </div>
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Privacy Policy
          </h1>
          <p className="mt-3 font-mono text-xs text-[#8A94A8]">Last updated: May 2026</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] p-6">
              <h2
                className="mb-4 text-lg font-bold text-white border-b border-[#DDE3EC]/10 pb-3"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.label} className="flex gap-3.5">
                    <div className="mt-2 h-1.5 w-1.5 rounded-full shrink-0 bg-[#3B82F6]" />
                    <div>
                      <span className="text-sm font-semibold text-white">{item.label} — </span>
                      <span className="text-sm text-[#94A3B8]">{item.text}</span>
                    </div>
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
          <Link href="/cookies" className="hover:text-white transition-colors">
            Cookie Policy →
          </Link>
        </div>
      </div>
    </div>
  )
}
