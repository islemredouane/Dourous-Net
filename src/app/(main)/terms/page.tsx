import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: "Read the Terms of Service for Dourous-Net, Algeria's digital learning platform.",
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using Dourous-Net ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. These terms apply to all users, including students, teachers, and visitors.',
  },
  {
    title: '2. Description of Service',
    content:
      'Dourous-Net is a digital learning platform that connects students with teachers across Algeria. The Platform provides access to educational sessions, video lessons, quizzes, and assignment submission tools. We reserve the right to modify, suspend, or discontinue any part of the service at any time.',
  },
  {
    title: '3. User Accounts',
    content:
      'To access protected learning tools, you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You agree to provide accurate information during registration.',
  },
  {
    title: '4. Acceptable Use',
    content:
      'You agree not to upload, post, or transmit unlawful or harmful content, attempt unauthorized access to any part of the Platform, or use automated tools to scrape data. Academic honesty is expected across all quizzes and assignments.',
  },
  {
    title: '5. Content Ownership',
    content:
      'Teachers retain ownership of the educational content they publish on Dourous-Net while granting a non-exclusive license to display that content to enrolled students. Students retain ownership of their submitted assignments.',
  },
  {
    title: '6. Intellectual Property',
    content:
      'The Dourous-Net name, logo, and platform design remain the intellectual property of the Platform.',
  },
  {
    title: '7. Disclaimer & Limitation of Liability',
    content:
      'The Platform is provided on an "as is" and "as available" basis without warranties of any kind. Dourous-Net shall not be liable for indirect or consequential damages arising from Platform use.',
  },
  {
    title: '8. Contact',
    content: 'Questions about these Terms may be directed to legal@dourous-net.dz.',
  },
]

export default function TermsPage() {
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
          <p className="eyebrow text-[#7F97C7] mb-2">Legal Documentation</p>
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Terms of Service
          </h1>
          <p className="mt-3 font-mono text-xs text-[#8A94A8]">Last updated: May 2026</p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] p-6">
              <h2
                className="mb-2.5 text-base font-bold text-white"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed text-[#94A3B8]">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-6 text-xs font-mono text-[#AEC6FF]">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/cookies" className="hover:text-white transition-colors">
            Cookie Policy →
          </Link>
        </div>
      </div>
    </div>
  )
}
