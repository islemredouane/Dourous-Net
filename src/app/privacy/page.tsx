import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Dourous-Net',
  description: 'Learn how Dourous-Net collects, uses, and protects your personal data.',
}

const sections = [
  {
    title: 'Information We Collect',
    items: [
      { label: 'Account Information', text: 'When you register, we collect your full name, email address, and profile details you choose to provide.' },
      { label: 'Usage Data', text: 'We collect information about how you interact with the Platform — lessons watched, quizzes taken, and progress milestones reached.' },
      { label: 'Submitted Content', text: 'Files and assignments you upload are stored securely in our cloud storage and linked only to your account.' },
      { label: 'Technical Data', text: 'We automatically collect your IP address, browser type, device information, and cookies to ensure the Platform functions correctly.' },
    ],
  },
  {
    title: 'How We Use Your Information',
    items: [
      { label: 'Service Delivery', text: 'To authenticate your account, display your progress, and connect you with the courses and teachers you enroll with.' },
      { label: 'Improvement', text: 'To understand how users navigate the Platform and improve features, performance, and content quality.' },
      { label: 'Communication', text: 'To send you important service notifications, password reset emails, and updates about your enrolled sessions.' },
      { label: 'Security', text: 'To detect and prevent fraud, abuse, and unauthorized access to the Platform.' },
    ],
  },
  {
    title: 'Data Storage & Security',
    items: [
      { label: 'Infrastructure', text: 'Your data is stored on Supabase (PostgreSQL) and served via Vercel — both SOC 2 compliant cloud providers.' },
      { label: 'Encryption', text: 'All data is transmitted over HTTPS/TLS. Passwords are never stored in plain text.' },
      { label: 'Row-Level Security', text: 'We use Supabase Row-Level Security (RLS) to ensure each user can only access their own data at the database level.' },
      { label: 'Retention', text: 'We retain your data for as long as your account is active. You may request deletion at any time.' },
    ],
  },
  {
    title: 'Your Rights',
    items: [
      { label: 'Access', text: 'You have the right to request a copy of the personal data we hold about you.' },
      { label: 'Correction', text: 'You can update your profile information at any time from your account settings.' },
      { label: 'Deletion', text: 'You may request full deletion of your account and associated data by contacting privacy@dourous-net.dz.' },
      { label: 'Portability', text: 'You may request an export of your personal data in a machine-readable format.' },
    ],
  },
  {
    title: 'Third-Party Services',
    items: [
      { label: 'Google OAuth', text: 'If you sign in with Google, we receive your name and email address from Google. We do not receive your Google password.' },
      { label: 'Google Gemini', text: 'Our AI Coach feature sends lesson context to Google\'s Gemini API. No personal identifying information is included in these requests.' },
      { label: 'YouTube', text: 'Video lessons may be embedded from YouTube. YouTube\'s own privacy policy applies to any interactions with embedded videos.' },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: '#030712', fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400">Your privacy matters</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: May 2026</p>
        </div>

        <p className="mb-10 text-slate-400 leading-relaxed">
          At Dourous-Net, we take your privacy seriously. This policy explains what data we collect, why we collect it, and how we keep it safe. We do not sell your personal data to third parties — ever.
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-4 text-lg font-semibold text-white border-b border-white/[0.06] pb-3">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500 mt-2" />
                    <div>
                      <span className="text-sm font-medium text-white">{item.label} — </span>
                      <span className="text-sm text-slate-400">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
          <h3 className="mb-2 font-semibold text-white">Questions about your data?</h3>
          <p className="text-sm text-slate-400">
            Contact our privacy team at{' '}
            <span className="text-indigo-400">privacy@dourous-net.dz</span>
            {' '}and we will respond within 5 business days.
          </p>
        </div>

        <div className="mt-8 flex gap-4 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service →</Link>
          <Link href="/cookies" className="hover:text-indigo-400 transition-colors">Cookie Policy →</Link>
        </div>
      </div>
    </div>
  )
}
