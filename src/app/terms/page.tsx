import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — Dourous-Net',
  description: 'Read the Terms of Service for Dourous-Net, Algeria\'s digital learning platform.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using Dourous-Net ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. These terms apply to all users, including students, teachers, and visitors.`,
  },
  {
    title: '2. Description of Service',
    content: `Dourous-Net is a digital learning platform that connects students with teachers across Algeria. The Platform provides access to educational sessions, video lessons, quizzes, and assignment submission tools. We reserve the right to modify, suspend, or discontinue any part of the service at any time.`,
  },
  {
    title: '3. User Accounts',
    content: `To access most features, you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You agree to provide accurate, current, and complete information during registration. You may not share your account with others or create accounts for the purpose of abuse.`,
  },
  {
    title: '4. Acceptable Use',
    content: `You agree not to use the Platform to upload, post, or transmit any content that is unlawful, harmful, abusive, or otherwise objectionable. You may not attempt to gain unauthorized access to any part of the Platform, interfere with its operation, or use automated tools to scrape or extract data. Academic honesty is expected at all times.`,
  },
  {
    title: '5. Content Ownership',
    content: `Teachers retain ownership of the educational content they create and publish on Dourous-Net. By publishing content on the Platform, teachers grant Dourous-Net a non-exclusive, royalty-free license to display and distribute that content to enrolled students. Students retain ownership of their submitted assignments.`,
  },
  {
    title: '6. Intellectual Property',
    content: `The Dourous-Net name, logo, design, and all associated materials are the intellectual property of the Platform. You may not reproduce, distribute, or create derivative works from our content without express written permission.`,
  },
  {
    title: '7. Disclaimer of Warranties',
    content: `The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of viruses or other harmful components.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `To the fullest extent permitted by applicable law, Dourous-Net shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of, or inability to use, the Platform or its content.`,
  },
  {
    title: '9. Changes to Terms',
    content: `We may update these Terms of Service from time to time. We will notify registered users of significant changes via email or an in-platform notification. Continued use of the Platform after changes take effect constitutes acceptance of the revised terms.`,
  },
  {
    title: '10. Contact',
    content: `If you have any questions about these Terms, please contact us at legal@dourous-net.dz.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: '#030712', fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">Legal</p>
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: May 2026</p>
        </div>

        <p className="mb-10 text-slate-400 leading-relaxed">
          Please read these Terms of Service carefully before using Dourous-Net. These terms govern your access to and use of our platform and services.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="mb-3 text-base font-semibold text-white">{section.title}</h2>
              <p className="text-sm leading-relaxed text-slate-400">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex gap-4 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy →</Link>
          <Link href="/cookies" className="hover:text-indigo-400 transition-colors">Cookie Policy →</Link>
        </div>
      </div>
    </div>
  )
}
