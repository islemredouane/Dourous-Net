import Link from 'next/link'
import { MemberWelcomeBand } from './MemberWelcomeBand'
import { MemberPulseCard } from './MemberPulseCard'
import { CoursesPreviewTabs } from '@/components/sections/CoursesPreviewTabs'
import { SectionTitle } from '@/components/shared/SectionTitle'
import {
  BookOpen,
  ClipboardList,
  Clock,
  ExternalLink,
  GraduationCap,
  PlusCircle,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { CATEGORY_COLORS_LIGHT } from '@/lib/constants'
import type { Session, SessionWithTeacher, Student } from '@/types'

export interface TeacherSessionSummary extends Session {
  readonly enrollment_count: number
}

interface TeacherMemberHomeProps {
  readonly profile: Student | null
  readonly email: string
  readonly ownSessions: TeacherSessionSummary[]
  readonly totalLearners: number
  readonly submissionsCount: number
  readonly catalogSessions: SessionWithTeacher[]
}

export function TeacherMemberHome({
  profile,
  email,
  ownSessions,
  totalLearners,
  submissionsCount,
  catalogSessions,
}: TeacherMemberHomeProps) {
  const firstName =
    profile?.full_name?.split(' ')[0] ?? email.split('@')[0] ?? 'Educator'

  const eyebrow = [
    'Educator Workspace',
    profile?.field || 'Course Author',
  ].join(' · ')

  const ownIds = new Set(ownSessions.map((s) => s.id))
  const peerSessions = catalogSessions.filter((s) => !ownIds.has(s.id))
  const communitySessions = peerSessions.length > 0 ? peerSessions : catalogSessions

  return (
    <>
      <MemberWelcomeBand
        eyebrow={eyebrow}
        firstName={firstName}
        prompt="manage your curriculum and reach more learners."
        searchSelectId="teacher-home-category"
        actions={[
          {
            href: '/teacher/new',
            title: 'Publish a New Session',
            subtitle: 'Add course details, stream videos & author timed quizzes',
            icon: <PlusCircle className="h-5 w-5" />,
            accentClass: 'border-[#3B82F6]/35 bg-[#2563EB]/20 text-[#AEC6FF]',
            hoverBorderClass: 'hover:border-[#3B82F6]/60',
          },
          {
            href: '/teacher',
            title: 'Open Teacher Studio',
            subtitle: 'Inspect student PDF submissions & manage lesson sequences',
            icon: <GraduationCap className="h-5 w-5" />,
            accentClass: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
            hoverBorderClass: 'hover:border-emerald-400/50',
          },
        ]}
      />

      {/* Band 01: Teaching Overview & Quick Course Actions (Light Paper Surface) */}
      <section className="bg-[#F5F6F8] text-[#0B1120] py-14 sm:py-16 border-b border-[#1B2A55]/10">
        <div className="mx-auto max-w-[1240px] px-5 md:px-10 space-y-6">
          <MemberPulseCard
            eyebrow="01 · Your Teaching Pulse"
            summary={
              ownSessions.length > 0
                ? `Most recent session: ${ownSessions[0].title} (${ownSessions[0].enrollment_count} enrolled).`
                : 'Ready to share your expertise — publish your first structured video session.'
            }
            actionLabel="Manage All Sessions"
            actionHref="/teacher"
            metrics={[
              { label: 'Published Sessions', dotClass: 'bg-[#2563EB]', value: ownSessions.length, href: '/teacher' },
              { label: 'Enrolled Learners', dotClass: 'bg-emerald-500', value: totalLearners, href: '/teacher' },
              { label: 'PDF Submissions', dotClass: 'bg-amber-500', value: submissionsCount, href: '/teacher' },
            ]}
          />

          {ownSessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ownSessions.slice(0, 3).map((session) => {
                const catClass =
                  CATEGORY_COLORS_LIGHT[session.category] ?? CATEGORY_COLORS_LIGHT.General
                return (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-[#1B2A55]/12 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs hover:border-[#2563EB]/35 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${catClass}`}
                        >
                          {session.category}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#3A4458]">
                          <Users className="h-3 w-3 text-[#2563EB]" />
                          {session.enrollment_count}
                        </span>
                      </div>
                      <h3
                        className="text-base font-bold text-[#0B1120] line-clamp-2 leading-snug"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {session.title}
                      </h3>
                      <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-[#3A4458]">
                        <Clock className="h-3 w-3 text-[#7F97C7]" />
                        {session.duration_hours}h total curriculum
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Link
                        href={`/teacher/sessions/${session.id}/lessons`}
                        className="inline-flex items-center gap-1.5 h-10 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-4 text-[13px] font-semibold text-white transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Lessons</span>
                      </Link>
                      <Link
                        href={`/teacher/sessions/${session.id}/quiz`}
                        className="inline-flex items-center gap-1.5 h-10 rounded-full border border-[#1B2A55]/15 px-4 text-[13px] font-medium text-[#0B1120] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                        <span>Quiz</span>
                      </Link>
                      <Link
                        href={`/sessions/${session.id}`}
                        aria-label={`Preview ${session.title}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1B2A55]/15 text-[#3A4458] hover:border-[#0B1120] hover:text-[#0B1120] transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#1B2A55]/12 bg-white p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3
                  className="text-lg font-bold text-[#0B1120]"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Create your first course session
                </h3>
                <p className="mt-1 text-sm text-[#3A4458]">
                  Publish structured playlists, PDF exercises, and instant-graded quizzes for learners across Algeria.
                </p>
              </div>
              <Link
                href="/teacher/new"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-6 text-[13.5px] font-semibold text-white transition-colors shrink-0 self-start sm:self-auto"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Session</span>
              </Link>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#1B2A55]/12 bg-white px-5 py-4 text-sm text-[#3A4458]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#2563EB] shrink-0" />
              <span>
                <strong className="font-semibold text-[#0B1120]">Educator Privacy · RLS Secured.</strong>{' '}
                Only you can edit your syllabus lessons, quizzes, and view student assignment PDFs for your sessions.
              </span>
            </div>
            <Link
              href="/profile"
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] shrink-0"
            >
              Update educator bio →
            </Link>
          </div>
        </div>
      </section>

      {/* Band 02: Peer Catalog Discovery (Dark Surface) */}
      <section className="bg-[#0B1120] py-16 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-5 md:px-10">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionTitle
              eyebrow="02 · Community Catalog"
              title="Explore sessions across disciplines."
              subtitle="See how fellow educators structure lessons, interactive quizzes, and exercises."
              center={false}
              tone="dark"
              className="mb-0"
            />
            <Link
              href="/teachers"
              className="inline-flex shrink-0 items-center gap-2 h-10 rounded-full border border-[#DDE3EC]/18 bg-[#121A2E] px-5 text-xs font-medium text-[#DDE3EC] hover:border-[#3B82F6] hover:text-white transition-colors self-start sm:self-auto"
            >
              <Users className="h-3.5 w-3.5 text-[#AEC6FF]" />
              <span>Educator Directory</span>
            </Link>
          </div>

          <CoursesPreviewTabs
            sessions={communitySessions}
            tone="dark"
            layoutId="teacher-home-tabs"
          />
        </div>
      </section>
    </>
  )
}
