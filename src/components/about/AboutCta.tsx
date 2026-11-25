'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { ArrowRight, BookOpen, GraduationCap, LayoutDashboard, ShieldCheck } from 'lucide-react'

export function AboutCta() {
  const { user, profile, loading } = useUser()
  const isTeacher = profile?.role === 'teacher'

  return (
    <div className="mt-12 rounded-3xl border border-[#DDE3EC]/12 bg-[#0E1526] p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {loading
              ? 'Ready to explore live courses?'
              : user
              ? isTeacher
                ? 'Manage your sessions or browse the catalog'
                : 'Continue your courses anytime'
              : 'Ready to explore live courses?'}
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            {loading
              ? 'Open courses across six academic disciplines with video lessons and quizzes.'
              : user
              ? isTeacher
                ? 'Open your Teacher Studio to publish new lessons and quizzes, or explore other tracks.'
                : 'Jump back into your enrolled lessons, timed quizzes, and AI Learning Coach.'
              : 'Start watching lessons right away or create your free student/teacher account.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 shrink-0">
        {loading ? (
          <>
            <div className="h-11 w-36 rounded-full bg-[#121A2E] border border-[#DDE3EC]/15 animate-pulse" />
            <div className="h-11 w-36 rounded-full bg-[#121A2E] border border-[#DDE3EC]/10 animate-pulse" />
          </>
        ) : user ? (
          <>
            <Link
              href={isTeacher ? '/teacher' : '/dashboard'}
              className="inline-flex items-center gap-2 h-11 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
            >
              {isTeacher ? (
                <>
                  <GraduationCap className="h-4 w-4" />
                  <span>Teacher Studio</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </>
              )}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 h-11 rounded-full px-6 border border-[#DDE3EC]/20 text-sm font-semibold text-[#DDE3EC] hover:border-white hover:text-white transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse Catalog</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 h-11 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse Catalog</span>
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 h-11 rounded-full px-6 border border-[#DDE3EC]/20 text-sm font-semibold text-[#DDE3EC] hover:border-white hover:text-white transition-colors"
            >
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
