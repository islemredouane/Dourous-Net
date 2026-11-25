import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EnrollButton } from '@/components/sessions/EnrollButton'
import { CATEGORY_COLORS, CATEGORY_GRADIENTS, SITE_CONFIG } from '@/lib/constants'
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Lock,
  Play,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import type { SessionWithTeacher, Lesson, Assignment } from '@/types'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const supabase = await createClient()

  const { data } = await supabase
    .from('sessions')
    .select('id, title, description, category, thumbnail_url, teacher:students(full_name)')
    .eq('id', id)
    .single()

  if (!data) {
    return {
      title: 'Session Not Found',
      robots: { index: false, follow: false },
    }
  }

  const sessionMeta = data as {
    id: string
    title: string
    description: string | null
    category: string
    thumbnail_url: string | null
    teacher: { full_name?: string } | { full_name?: string }[] | null
  }

  const teacherName = Array.isArray(sessionMeta.teacher)
    ? sessionMeta.teacher[0]?.full_name
    : sessionMeta.teacher?.full_name

  const title = sessionMeta.title
  const description =
    sessionMeta.description?.trim() ||
    `${sessionMeta.category} course${teacherName ? ` taught by ${teacherName}` : ''} on ${SITE_CONFIG.name}.`
  const ogImage = sessionMeta.thumbnail_url || '/og/sessions.jpg'

  return {
    title,
    description,
    alternates: { canonical: `/sessions/${sessionMeta.id}` },
    openGraph: {
      type: 'article',
      url: `/sessions/${sessionMeta.id}`,
      title: `${title} · ${SITE_CONFIG.name}`,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} — ${sessionMeta.category} course on ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${SITE_CONFIG.name}`,
      description,
      images: [ogImage],
    },
  }
}

export default async function SessionDetailPage(props: Props) {
  const { id } = await props.params
  const supabase = await createClient()

  const { data } = await supabase
    .from('sessions')
    .select('*, teacher:students(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const session = data as SessionWithTeacher
  const categoryColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS.General
  const categoryGradient = CATEGORY_GRADIENTS[session.category] ?? CATEGORY_GRADIENTS.General

  const [{ data: lessonsRaw }, { data: assignmentsRaw }, { data: { user } }, { count: enrollmentCount }] =
    await Promise.all([
      supabase
        .from('lessons')
        .select('id, title, duration_minutes, order_index')
        .eq('session_id', id)
        .order('order_index', { ascending: true }),
      supabase
        .from('assignments')
        .select('id, title, total_points, time_limit_minutes')
        .eq('session_id', id)
        .order('created_at', { ascending: true }),
      supabase.auth.getUser(),
      supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', id),
    ])

  const lessons = (lessonsRaw ?? []) as Pick<
    Lesson,
    'id' | 'title' | 'duration_minutes' | 'order_index'
  >[]
  const assignments = (assignmentsRaw ?? []) as Pick<
    Assignment,
    'id' | 'title' | 'total_points' | 'time_limit_minutes'
  >[]

  let isEnrolled = false
  let enrollmentProgress = 0
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, progress')
      .eq('student_id', user.id)
      .eq('session_id', id)
      .maybeSingle()
    isEnrolled = !!enrollment
    enrollmentProgress = enrollment?.progress ?? 0
  }

  const totalMinutes = lessons.reduce((a, l) => a + (l.duration_minutes ?? 0), 0)
  const totalDuration =
    totalMinutes > 0
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
      : `${session.duration_hours}h`

  const teacherInitial = session.teacher?.full_name?.charAt(0).toUpperCase() ?? 'T'

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Header Band */}
      <div className={`relative overflow-hidden border-b border-[#DDE3EC]/10 ${categoryGradient}`}>
        {session.thumbnail_url && (
          <img
            src={session.thumbnail_url}
            alt={session.title}
            className="absolute inset-0 h-full w-full object-cover opacity-15"
          />
        )}
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/60 via-[#0B1120]/75 to-[#0B1120]" />

        <div className="relative mx-auto max-w-[1240px] px-5 md:px-10 pt-32 pb-12">
          <Link
            href="/sessions"
            className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Catalog</span>
          </Link>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href={`/sessions?category=${encodeURIComponent(session.category)}`}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${categoryColor}`}
                >
                  {session.category}
                </Link>
                {session.is_free && (
                  <span className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                    Free Access
                  </span>
                )}
                {isEnrolled && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3B82F6]/35 bg-[#2563EB]/20 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#AEC6FF]">
                    <CheckCircle2 className="h-3 w-3" /> Enrolled
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.08] tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {session.title}
              </h1>

              {session.description && (
                <p className="text-[#DDE3EC]/80 text-base leading-relaxed max-w-2xl mb-7">
                  {session.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#94A3B8] pt-5 border-t border-[#DDE3EC]/10">
                {session.teacher && (
                  <Link
                    href={`/teachers/${session.teacher_id}`}
                    className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                      {teacherInitial}
                    </span>
                    <span className="font-medium text-white">
                      {session.teacher.full_name}
                    </span>
                  </Link>
                )}
                <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                  <Clock className="h-3.5 w-3.5 text-[#7F97C7]" /> {totalDuration}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                  <Play className="h-3.5 w-3.5 text-[#7F97C7]" /> {lessons.length} lessons
                </span>
                {(enrollmentCount ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                    <Users className="h-3.5 w-3.5 text-[#7F97C7]" /> {enrollmentCount} enrolled
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1240px] px-5 md:px-10 py-12 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Mobile Enroll Card */}
            <div className="lg:hidden">
              <EnrollCard
                session={session}
                lessons={lessons}
                assignments={assignments}
                isEnrolled={isEnrolled}
                enrollmentProgress={enrollmentProgress}
                totalDuration={totalDuration}
                sessionId={id}
                userId={user?.id}
                teacherInitial={teacherInitial}
              />
            </div>

            {/* Lessons Curriculum */}
            {lessons.length === 0 ? (
              <section className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] p-10 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-[#7F97C7]" />
                <p className="text-sm font-semibold text-white">Curriculum coming soon</p>
                <p className="text-xs text-[#8A94A8] mt-1">
                  The instructor is preparing video lessons for this session.
                </p>
              </section>
            ) : (
              <section className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE3EC]/10 bg-[#0E1526]">
                  <div>
                    <p className="eyebrow text-[#7F97C7]">Syllabus</p>
                    <h2
                      className="text-lg font-bold text-white mt-0.5"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      Course Curriculum
                    </h2>
                  </div>
                  <span className="rounded-full border border-[#DDE3EC]/12 bg-[#080E1D] px-3 py-1 font-mono text-xs text-[#AEC6FF]">
                    {lessons.length} lessons · {totalDuration}
                  </span>
                </div>

                <div className="divide-y divide-[#DDE3EC]/8">
                  {lessons.map((lesson, i) => {
                    const rowContent = (
                      <div className="flex items-center gap-4 px-6 py-4 hover:bg-[#162038] transition-colors group">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#DDE3EC]/15 bg-[#080E1D] font-mono text-xs font-semibold text-[#AEC6FF] group-hover:border-[#3B82F6] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-[#AEC6FF] transition-colors truncate">
                            {lesson.title}
                          </p>
                          {lesson.duration_minutes > 0 && (
                            <p className="font-mono text-[11px] text-[#8A94A8] mt-0.5">
                              {lesson.duration_minutes} min
                            </p>
                          )}
                        </div>
                        {isEnrolled ? (
                          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-[#3B82F6]/35 bg-[#2563EB]/15 px-3 py-1.5 text-xs font-medium text-[#AEC6FF] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                            <Play className="h-3 w-3" /> Watch
                          </span>
                        ) : (
                          <Lock className="h-4 w-4 shrink-0 text-[#8A94A8]" />
                        )}
                      </div>
                    )

                    return isEnrolled ? (
                      <Link key={lesson.id} href={`/sessions/${id}/learn/${lesson.id}`} className="block">
                        {rowContent}
                      </Link>
                    ) : (
                      <div key={lesson.id}>{rowContent}</div>
                    )
                  })}
                </div>

                {isEnrolled && (
                  <div className="px-6 py-4 border-t border-[#DDE3EC]/10 bg-[#0E1526]">
                    <Link
                      href={`/sessions/${id}/learn`}
                      className="flex items-center justify-center gap-2 h-11 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Continue Learning</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Quizzes */}
            {assignments.length > 0 && (
              <section className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE3EC]/10 bg-[#0E1526]">
                  <div>
                    <p className="eyebrow text-[#7F97C7]">Evaluation</p>
                    <h2
                      className="text-lg font-bold text-white mt-0.5"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      Quizzes &amp; Assessments
                    </h2>
                  </div>
                  <span className="rounded-full border border-[#DDE3EC]/12 bg-[#080E1D] px-3 py-1 font-mono text-xs text-[#AEC6FF]">
                    {assignments.length} total
                  </span>
                </div>

                <div className="divide-y divide-[#DDE3EC]/8">
                  {assignments.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-[#162038] transition-colors group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-500/10 text-emerald-300">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                        <p className="font-mono text-[11px] text-[#8A94A8] mt-0.5">
                          {a.total_points} pts
                          {a.time_limit_minutes > 0 ? ` · ${a.time_limit_minutes} min limit` : ' · Untimed'}
                        </p>
                      </div>
                      {isEnrolled ? (
                        <Link
                          href={`/sessions/${id}/quiz/${a.id}`}
                          className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-emerald-400/35 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                          <span>Open Quiz</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        <Lock className="h-4 w-4 shrink-0 text-[#8A94A8]" />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-[calc(7rem+var(--pwa-safe-top))]">
              <EnrollCard
                session={session}
                lessons={lessons}
                assignments={assignments}
                isEnrolled={isEnrolled}
                enrollmentProgress={enrollmentProgress}
                totalDuration={totalDuration}
                sessionId={id}
                userId={user?.id}
                teacherInitial={teacherInitial}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function EnrollCard({
  session,
  lessons,
  assignments,
  isEnrolled,
  enrollmentProgress,
  totalDuration,
  sessionId,
  userId,
  teacherInitial,
}: {
  session: SessionWithTeacher
  lessons: Pick<Lesson, 'id' | 'title' | 'duration_minutes' | 'order_index'>[]
  assignments: Pick<Assignment, 'id' | 'title'>[]
  isEnrolled: boolean
  enrollmentProgress: number
  totalDuration: string
  sessionId: string
  userId?: string
  teacherInitial: string
}) {
  return (
    <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-[#DDE3EC]/10 bg-[#0E1526]">
        <p className="eyebrow text-[#7F97C7] mb-1">Enrollment</p>
        <div className="flex items-baseline gap-2.5">
          <span
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {session.is_free ? 'Free' : 'Open'}
          </span>
          <span className="text-xs font-mono text-emerald-300">
            · Instant Workspace Access
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-[#8A94A8]">
          {totalDuration} total study time
        </p>
      </div>

      <div className="px-6 py-5 border-b border-[#DDE3EC]/10">
        {isEnrolled ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#94A3B8]">Your Progress</span>
                <span className="font-mono text-xs font-bold text-[#AEC6FF]">
                  {enrollmentProgress}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden bg-[#080E1D]">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                  style={{ width: `${enrollmentProgress}%` }}
                />
              </div>
            </div>
            <Link
              href={`/sessions/${sessionId}/learn`}
              className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>{enrollmentProgress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
            </Link>
            <Link
              href="/dashboard"
              className="block text-center text-xs font-mono text-[#AEC6FF] hover:text-white transition-colors"
            >
              Open Student Dashboard →
            </Link>
          </div>
        ) : (
          <EnrollButton sessionId={sessionId} studentId={userId} />
        )}
      </div>

      <div className="px-6 py-5 space-y-2.5">
        <p className="eyebrow text-[#8A94A8] mb-3">Included in Session</p>
        {[
          { icon: Play, text: `${lessons.length} structured video lesson${lessons.length !== 1 ? 's' : ''}` },
          { icon: FileText, text: `${assignments.length} interactive quiz${assignments.length !== 1 ? 'zes' : ''}` },
          { icon: Award, text: 'Progress tracking & AI Coach' },
          { icon: BookOpen, text: 'Assignment PDF submission' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-xs text-[#DDE3EC]/80">
            <Icon className="h-4 w-4 text-[#60A5FA] shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {session.teacher && (
        <div className="px-6 py-4 border-t border-[#DDE3EC]/10 bg-[#0E1526]">
          <p className="eyebrow text-[#8A94A8] mb-3">Instructor</p>
          <Link href={`/teachers/${session.teacher_id}`} className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
              {teacherInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-[#AEC6FF] transition-colors truncate">
                {session.teacher.full_name}
              </p>
              <p className="font-mono text-[11px] text-[#8A94A8] capitalize">
                {session.teacher.field || `${session.teacher.level} educator`}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#7F97C7] group-hover:translate-x-0.5 transition-transform ml-auto shrink-0" />
          </Link>
        </div>
      )}
    </div>
  )
}
