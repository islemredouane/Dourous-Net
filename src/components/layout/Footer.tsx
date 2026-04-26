import Link from 'next/link'
import { GradientText } from '@/components/shared/GradientText'
import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-indigo-500/10 bg-[#030712]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                <GradientText>Dourous</GradientText>
                <span className="text-slate-100">-Net</span>
              </span>
            </div>
            <p className="max-w-sm text-sm text-slate-500">
              {"Algeria's premier digital academy. Expert-led sessions for the next generation of learners — learn anytime, anywhere."}
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/sessions" className="transition-colors hover:text-indigo-400">
                  Browse Sessions
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-indigo-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth" className="transition-colors hover:text-indigo-400">
                  Sign Up Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Project info */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Project</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>ISI 2CP — Module SI 2026</li>
              <li>Theme 4 — Education</li>
              <li>Built with Next.js + Supabase</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-500/10 pt-8 text-center text-sm text-slate-600">
          © 2026 Dourous-Net — ISI 2CP Project. Built with Next.js, Supabase & Three.js.
        </div>
      </div>
    </footer>
  )
}
