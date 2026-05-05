import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EnrollButton } from '@/components/sessions/EnrollButton'
import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from '@/lib/constants'
import {
  Clock, Play, FileText, Award, Lock, ArrowLeft,
  BookOpen, CheckCircle2, ChevronRight, Users
} from 'lucide-react'
import Link from 'next/link'
import type { SessionWithTeacher, Lesson, Assignment } from '@/types'

type Props = { params: Promise<{ id: string }> }

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
  const categoryColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS['General']
  const categoryGradient = CATEGORY_GRADIENTS[session.category] ?? CATEGORY_GRADIENTS['General']

  const { data: lessonsRaw } = await supabase
    .from('lessons')
    .select('id, title, duration_minutes, order_index')
    .eq('session_id', id)
    .order('order_index', { ascending: true })

  const lessons = (lessonsRaw ?? []) as Pick<Lesson, 'id' | 'title' | 'duration_minutes' | 'order_index'>[]

  const { data: assignmentsRaw } = await supabase
    .from('assignments')
    .select('id, title')
    .eq('session_id', id)
    .order('created_at', { ascending: true })

  const assignments = (assignmentsRaw ?? []) as Pick<Assignment, 'id' | 'title'>[]

  const { data: { user } } = await supabase.auth.getUser()

  let isEnrolled = false
  let enrollmentProgress = 0
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id, progress')
      .eq('student_id', user.id)
      .eq('session_id', id)
      .single()
    isEnrolled = !!enrollment
    enrollmentProgress = enrollment?.progress ?? 0
  }

  // Enrollment count
  const { count: enrollmentCount } = await supabase
    .from('enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', id)

  const totalMinutes = lessons.reduce((a, l) => a + (l.duration_minutes ?? 0), 0)
  const totalDuration = totalMinutes > 0
    ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
    : `${session.duration_hours}h`

  const teacherInitial = session.teacher?.full_name?.charAt(0).toUpperCase() ?? 'T'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#030712', fontFamily: 'var(--font-space-grotesk)' }}>

      {/* ── TOP HERO ── */}
      <div className={`relative overflow-hidden ${categoryGradient}`}>
        {session.thumbnail_url && (
          <img src={session.thumbnail_url} alt={session.title}
            className="absolute inset-0 h-full w-full object-cover opacity-20" />
        )}
        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#030712]" />

        <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-10">
          {/* Back */}
          <Link href="/sessions"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sessions
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
            {/* Left: title + meta */}
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${categoryColor}`}>
                  {session.category}
                </span>
                {session.is_free && (
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Free
                  </span>
                )}
                {isEnrolled && (
                  <span className="rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-300 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Enrolled
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight max-w-2xl mb-4">
                {session.title}
              </h1>

              {/* Description */}
              {session.description && (
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mb-6">
                  {session.description}
                </p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
                {session.teacher && (
                  <Link href={`/teachers/${session.teacher_id}`}
                    className="flex items-center gap-2 hover:text-indigo-300 transition-colors">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                      {teacherInitial}
                    </div>
                    <span>{session.teacher.full_name}</span>
                  </Link>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-400" /> {totalDuration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Play className="h-4 w-4 text-indigo-400" /> {lessons.length} lessons
                </span>
                {(enrollmentCount ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-indigo-400" /> {enrollmentCount} students
                  </span>
                )}
              </div>
            </div>

            {/* Right: Enrollment card — visible in hero on desktop */}
            <div className="hidden lg:block w-80 shrink-0">
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
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col lg:flex-row lg:gap-10">

          {/* ── MAIN COLUMN ── */}
          <div className="flex-1 min-w-0 space-y-6 mt-8">

            {/* Mobile enroll card */}
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

            {/* Curriculum */}
            {lessons.length === 0 && (
              <section className="rounded-2xl border border-white/[0.07] bg-[#0c1120] p-8 text-center">
                <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-700" />
                <p className="text-sm font-medium text-slate-400">Curriculum coming soon</p>
                <p className="text-xs text-slate-600 mt-1">The teacher hasn't added lessons yet.</p>
              </section>
            )}
            {lessons.length > 0 && (
              <section className="rounded-2xl border border-white/[0.07] bg-[#0c1120] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white">Course Content</h2>
                  <span className="text-xs text-slate-500 bg-white/5 rounded-full px-2.5 py-1">
                    {lessons.length} lessons · {totalDuration}
                  </span>
                </div>

                {/* Lesson list */}
                <div className="divide-y divide-white/[0.04]">
                  {lessons.map((lesson, i) => (
                    <div key={lesson.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                      {/* Number */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400">
                        {i + 1}
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                          {lesson.title}
                        </p>
                        {lesson.duration_minutes && lesson.duration_minutes > 0 && (
                          <p className="text-xs text-slate-600 mt-0.5">{lesson.duration_minutes} min</p>
                        )}
                      </div>

                      {/* Action */}
                      {isEnrolled ? (
                        <Link href={`/sessions/${id}/learn/${lesson.id}`}
                          className="shrink-0 flex items-center gap-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors opacity-0 group-hover:opacity-100">
                          <Play className="h-3 w-3" /> Watch
                        </Link>
                      ) : (
                        <Lock className="h-4 w-4 shrink-0 text-slate-700" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Continue button if enrolled */}
                {isEnrolled && (
                  <div className="px-6 py-4 border-t border-white/[0.06] bg-indigo-500/5">
                    <Link href={`/sessions/${id}/learn`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors shadow-glow-sm">
                      <Play className="h-4 w-4" />
                      Continue Learning
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Quizzes */}
            {assignments.length > 0 && (
              <section className="rounded-2xl border border-white/[0.07] bg-[#0c1120] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <h2 className="text-lg font-semibold text-white">Quizzes &amp; Assignments</h2>
                  <span className="text-xs text-slate-500 bg-white/5 rounded-full px-2.5 py-1">
                    {assignments.length} total
                  </span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {assignments.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        <FileText className="h-4 w-4 text-purple-400" />
                      </div>
                      <p className="flex-1 text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                        {a.title}
                      </p>
                      {isEnrolled ? (
                        <Link href={`/sessions/${id}/quiz/${a.id}`}
                          className="shrink-0 flex items-center gap-1 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors">
                          Take Quiz <ChevronRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        <Lock className="h-4 w-4 shrink-0 text-slate-700" />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── STICKY SIDEBAR (desktop only) ── */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 mt-8">
              {/* spacer — card is already rendered in hero, so just empty here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Enroll Card (shared mobile + desktop) ── */
function EnrollCard({
  session, lessons, assignments, isEnrolled, enrollmentProgress,
  totalDuration, sessionId, userId, teacherInitial,
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
    <div className="rounded-2xl border border-white/[0.09] bg-[#0c1120] shadow-[0_0_80px_rgba(99,102,241,0.1)] overflow-hidden">
      {/* Price header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-white">
            {session.is_free ? (
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Free</span>
            ) : 'Paid'}
          </span>
          {session.is_free && (
            <span className="text-sm text-slate-500">· No credit card needed</span>
          )}
        </div>
        <p className="text-xs text-slate-500">{totalDuration} of content</p>
      </div>

      {/* CTA */}
      <div className="px-6 py-4">
        {isEnrolled ? (
          <div className="space-y-3">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400 font-medium">Your progress</span>
                <span className="text-xs font-bold text-indigo-400">{enrollmentProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                  style={{ width: `${enrollmentProgress}%` }}
                />
              </div>
            </div>
            <Link href={`/sessions/${sessionId}/learn`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors shadow-glow-sm">
              <Play className="h-4 w-4" />
              {enrollmentProgress > 0 ? 'Continue Learning' : 'Start Learning'}
            </Link>
            <Link href="/dashboard"
              className="block text-center text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <EnrollButton sessionId={sessionId} studentId={userId} />
        )}
      </div>

      {/* What's included */}
      <div className="px-6 pb-5 space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">What's included</p>
        {[
          { icon: Play, text: `${lessons.length} video lesson${lessons.length !== 1 ? 's' : ''}` },
          { icon: FileText, text: `${assignments.length} quiz${assignments.length !== 1 ? 'zes' : ''}` },
          { icon: Award, text: 'Certificate of completion' },
          { icon: BookOpen, text: 'Lifetime access' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-sm text-slate-400">
            <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
            {text}
          </div>
        ))}
      </div>

      {/* Instructor */}
      {session.teacher && (
        <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Instructor</p>
          <Link href={`/teachers/${session.teacher_id}`} className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
              {teacherInitial}
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                {session.teacher.full_name}
              </p>
              <p className="text-xs text-slate-500 capitalize">{session.teacher.level} level</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors ml-auto" />
          </Link>
        </div>
      )}
    </div>
  )
}
