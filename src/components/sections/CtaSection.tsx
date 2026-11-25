'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { ArrowRight, GraduationCap, LayoutDashboard, PlusCircle } from 'lucide-react'

export function CtaSection() {
  const { user, profile, loading } = useUser()
  const isTeacher = profile?.role === 'teacher'

  return (
    <section className="relative overflow-hidden bg-[#0B1120] py-24 border-t border-[#DDE3EC]/10">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[360px] bg-[#2563EB]/15 blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-10 text-center">
        <p className="eyebrow text-[#AEC6FF]">
          {user ? (isTeacher ? 'Educator Workspace' : 'Your Workspace') : 'Get Started'}
        </p>
        <h2
          className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06]"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          {user ? (
            isTeacher ? (
              <>
                Ready to publish your
                <br />
                next structured session?
              </>
            ) : (
              <>
                Ready to continue
                <br />
                mastering new tracks?
              </>
            )
          ) : (
            <>
              Ready to start learning
              <br />
              or teaching today?
            </>
          )}
        </h2>
        <p
          className="mx-auto mt-5 max-w-xl text-lg italic text-[#AEC6FF]/90"
          style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
        >
          &ldquo;Join Algerian learners and educators building mastery session by session.&rdquo;
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          {loading ? (
            <div className="h-12 w-52 rounded-full bg-[#121A2E] border border-[#DDE3EC]/15 animate-pulse" />
          ) : user ? (
            isTeacher ? (
              <>
                <Link
                  href="/teacher"
                  className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-7 text-sm font-semibold text-white transition-colors w-full sm:w-auto"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Open Teacher Studio</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/teacher/new"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#DDE3EC]/25 bg-[#121A2E] hover:border-[#AEC6FF] px-7 text-sm font-medium text-[#DDE3EC] hover:text-white transition-colors w-full sm:w-auto"
                >
                  <PlusCircle className="h-4 w-4 text-[#AEC6FF]" />
                  <span>Create Session</span>
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-7 text-sm font-semibold text-white transition-colors w-full sm:w-auto"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )
          ) : (
            <Link
              href="/auth"
              className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-7 text-sm font-semibold text-white transition-colors w-full sm:w-auto"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <Link
            href="/sessions"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#DDE3EC]/25 bg-[#121A2E] hover:border-[#AEC6FF] px-7 text-sm font-medium text-[#DDE3EC] hover:text-white transition-colors w-full sm:w-auto"
          >
            <span>Browse Sessions</span>
          </Link>
          <Link
            href="/teachers"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#DDE3EC]/15 hover:border-[#DDE3EC]/40 px-7 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors w-full sm:w-auto"
          >
            <GraduationCap className="h-4 w-4 text-[#7F97C7]" />
            <span>Meet Instructors</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
