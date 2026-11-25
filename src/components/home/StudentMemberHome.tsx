import Link from 'next/link'
import { MemberWelcomeBand } from './MemberWelcomeBand'
import { MemberPulseCard } from './MemberPulseCard'
import { CoursesPreviewTabs } from '@/components/sections/CoursesPreviewTabs'
import { SectionTitle } from '@/components/shared/SectionTitle'
import {
  BookOpen,
  CheckCircle2,
  Compass,
  LayoutDashboard,
  Play,
} from 'lucide-react'
import { CATEGORY_COLORS_LIGHT } from '@/lib/constants'
import type { EnrollmentWithSession, SessionWithTeacher, Student } from '@/types'

interface StudentMemberHomeProps {
  readonly profile: Student | null
  readonly email: string
  readonly enrollments: EnrollmentWithSession[]
  readonly avgQuizPct: number | null
  readonly catalogSessions: SessionWithTeacher[]
}

export function StudentMemberHome({
  profile,
  email,
  enrollments,
  avgQuizPct,
  catalogSessions,
}: StudentMemberHomeProps) {
  const firstName =
    profile?.full_name?.split(' ')[0] ?? email.split('@')[0] ?? 'Learner'

  const activeEnrollment =
    enrollments.find((e) => e.status === 'in_progress') ??
    enrollments.find((e) => e.status === 'enrolled') ??
    null

  const activeCount = enrollments.filter((e) => e.status !== 'completed').length
  const completedCount = enrollments.filter((e) => e.status === 'completed').length

  const enrolledSessionIds = new Set(enrollments.map((e) => e.session_id))
  const unEnrolled = catalogSessions.filter((s) => !enrolledSessionIds.has(s.id))
  const recommended = unEnrolled.length > 0 ? unEnrolled : catalogSessions

  const eyebrow = [
    'Student Workspace',
    profile?.level ?? 'Active Learner',
    profile?.field,
  ]
    .filter(Boolean)
    .join(' · ')

  const primaryAction = activeEnrollment?.session
    ? {
        href: `/sessions/${activeEnrollment.session_id}/learn`,
        title: `Resume: ${activeEnrollment.session.title}`,
        subtitle: `${activeEnrollment.progress}% completed — jump right back into the lesson player`,
        icon: <Play className="h-5 w-5 fill-current" />,
        accentClass: 'border-[#3B82F6]/35 bg-[#2563EB]/20 text-[#AEC6FF]',
        hoverBorderClass: 'hover:border-[#3B82F6]/60',
      }
    : {
        href: '/sessions',
        title: 'Explore Open Courses',
        subtitle: 'Start your first video session across six disciplines',
        icon: <Compass className="h-5 w-5" />,
        accentClass: 'border-[#3B82F6]/35 bg-[#2563EB]/20 text-[#AEC6FF]',
        hoverBorderClass: 'hover:border-[#3B82F6]/60',
      }

  const secondaryAction = {
    href: '/dashboard',
    title: 'My Learning Dashboard',
    subtitle: 'Track quiz analytics, coursework PDFs & certificates',
    icon: <LayoutDashboard className="h-5 w-5" />,
    accentClass: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
    hoverBorderClass: 'hover:border-emerald-400/50',
  }

  return (
    <>
      <MemberWelcomeBand
        eyebrow={eyebrow}
        firstName={firstName}
        prompt="what would you like to master today?"
        searchSelectId="student-home-category"
        actions={[primaryAction, secondaryAction]}
      />

      {/* Band 01: Student Pulse & Enrolled Courses (Light architectural surface) */}
      <section className="bg-[#F5F6F8] text-[#0B1120] py-14 sm:py-16 border-b border-[#1B2A55]/10">
        <div className="mx-auto max-w-[1240px] px-5 md:px-10 space-y-6">
          <MemberPulseCard
            eyebrow="01 · Your Learning Pulse"
            summary={
              activeEnrollment?.session
                ? `Currently studying ${activeEnrollment.session.title} (${activeEnrollment.progress}% done).`
                : completedCount > 0
                ? `You've completed ${completedCount} course${completedCount > 1 ? 's' : ''}. Pick your next session below.`
                : 'No active enrollments yet — enroll in any course to track progress here.'
            }
            actionLabel="Open Dashboard"
            actionHref="/dashboard"
            metrics={[
              { label: 'In Progress', dotClass: 'bg-[#2563EB]', value: activeCount, href: '/dashboard' },
              { label: 'Completed', dotClass: 'bg-emerald-500', value: completedCount, href: '/dashboard' },
              { label: 'Quiz Mastery', dotClass: 'bg-amber-500', value: avgQuizPct !== null ? `${avgQuizPct}%` : '—', href: '/dashboard' },
            ]}
          />

          {/* Quick Enrolled Cards Strip (up to 3) */}
          {enrollments.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.slice(0, 3).map((e) => {
                const session = e.session
                if (!session) return null
                const catClass =
                  CATEGORY_COLORS_LIGHT[session.category] ?? CATEGORY_COLORS_LIGHT.General
                return (
                  <div
                    key={e.id}
                    className="rounded-2xl border border-[#1B2A55]/12 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs hover:border-[#2563EB]/35 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${catClass}`}
                        >
                          {session.category}
                        </span>
                        {e.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] font-semibold text-[#2563EB]">
                            {e.progress}%
                          </span>
                        )}
                      </div>
                      <h3
                        className="text-base font-bold text-[#0B1120] line-clamp-2 leading-snug"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {session.title}
                      </h3>
                      <div className="mt-3 h-1.5 w-full rounded-full overflow-hidden bg-[#1B2A55]/10">
                        <div
                          className={`h-full rounded-full ${
                            e.progress === 100 ? 'bg-emerald-500' : 'bg-[#2563EB]'
                          }`}
                          style={{ width: `${e.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <Link
                        href={`/sessions/${session.id}/learn`}
                        className="inline-flex items-center gap-1.5 h-10 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-4.5 text-[13px] font-semibold text-white transition-colors"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{e.status === 'completed' ? 'Review' : 'Continue'}</span>
                      </Link>
                      <Link
                        href={`/sessions/${session.id}`}
                        className="inline-flex items-center h-10 rounded-full border border-[#1B2A55]/15 px-4 text-[13px] font-medium text-[#3A4458] hover:border-[#0B1120] hover:text-[#0B1120] transition-colors"
                      >
                        Syllabus
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Band 02: Recommended New Sessions (Dark architectural grid) */}
      <section className="bg-[#0B1120] py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 md:px-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionTitle
              eyebrow="02 · Explore Next Sessions"
              title="Discover courses for your track."
              subtitle="Browse curated Algerian video sessions, timed quizzes, and AI coaching."
              center={false}
              tone="dark"
              className="mb-0"
            />
            <Link
              href="/teachers"
              className="inline-flex shrink-0 items-center gap-2 h-11 rounded-full border border-[#DDE3EC]/18 bg-[#121A2E] px-5 text-[13px] font-medium text-[#DDE3EC] hover:border-[#3B82F6] hover:text-white transition-colors self-start sm:self-auto"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#AEC6FF]" />
              <span>Meet Educators</span>
            </Link>
          </div>

          <CoursesPreviewTabs
            sessions={recommended}
            tone="dark"
            layoutId="student-home-tabs"
          />
        </div>
      </section>
    </>
  )
}
