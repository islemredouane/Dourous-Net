import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EnrollButton } from '@/components/sessions/EnrollButton'
import { GradientText } from '@/components/shared/GradientText'
import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from '@/lib/constants'
import { Clock, User, BookOpen, ArrowLeft, Play, FileText, Award, Lock } from 'lucide-react'
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

  // Fetch lessons for curriculum preview
  const { data: lessonsRaw } = await supabase
    .from('lessons')
    .select('id, title, duration_minutes, order_index')
    .eq('session_id', id)
    .order('order_index', { ascending: true })

  const lessons = (lessonsRaw ?? []) as Pick<Lesson, 'id' | 'title' | 'duration_minutes' | 'order_index'>[]

  // Fetch assignments count
  const { data: assignmentsRaw } = await supabase
    .from('assignments')
    .select('id, title')
    .eq('session_id', id)
    .order('created_at', { ascending: true })

  const assignments = (assignmentsRaw ?? []) as Pick<Assignment, 'id' | 'title'>[]

  // Get current user + enrollment status
  const { data: { user } } = await supabase.auth.getUser()

  let isEnrolled = false
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('session_id', id)
      .single()
    isEnrolled = !!enrollment
  }

  const totalMinutes = lessons.reduce((a, l) => a + (l.duration_minutes ?? 0), 0)
  const totalHours = totalMinutes > 0
    ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
    : session.duration_hours > 0
    ? `${session.duration_hours}h`
    : null

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#030712' }}>
      {/* Hero banner */}
      <div className={`relative h-64 md:h-80 w-full overflow-hidden ${categoryGradient}`}>
        {session.thumbnail_url ? (
          <img
            src={session.thumbnail_url}
            alt={session.title}
            className="h-full w-full object-cover opacity-40"
          />
        ) : (
          <>
            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/60 to-[#030712]" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-4 pb-8">
          <Link
            href="/sessions"
            className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-indigo-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sessions
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${categoryColor}`}>
              {session.category}
            </span>
            {session.is_free && (
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                Free
              </span>
            )}
          </div>
          <h1
            className="text-2xl font-bold text-white md:text-4xl max-w-3xl"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {session.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-8">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meta row */}
            <div className="flex flex-wrap gap-5 text-sm text-slate-500 border-b border-white/[0.06] pb-6">
              {session.teacher && (
                <Link
                  href={`/teachers/${session.teacher_id}`}
                  className="flex items-center gap-2 transition-colors hover:text-indigo-400"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                    {session.teacher.full_name.charAt(0)}
                  </div>
                  <span>{session.teacher.full_name}</span>
                </Link>
              )}
              {totalHours && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  {totalHours}
                </div>
              )}
              {lessons.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Play className="h-4 w-4 text-indigo-400" />
                  {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                </div>
              )}
              {assignments.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  {assignments.length} quiz{assignments.length !== 1 ? 'zes' : ''}
                </div>
              )}
            </div>

            {/* Description */}
            {session.description && (
              <div className="rounded-2xl border border-white/[0.07] bg-[#0f172a] p-6">
                <h2 className="mb-3 font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  About this course
                </h2>
                <p className="leading-relaxed text-slate-400 text-sm">{session.description}</p>
              </div>
            )}

            {/* Curriculum */}
            {lessons.length > 0 && (
              <div className="rounded-2xl border border-white/[0.07] bg-[#0f172a] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <h2 className="font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    Course Curriculum
                  </h2>
                  <span className="text-xs text-slate-500">{lessons.length} lessons</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {lessons.map((lesson, i) => (
                    <div key={lesson.id} className="flex items-center gap-4 px-6 py-3.5 group">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm text-slate-300 group-hover:text-white transition-colors">
                          {lesson.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {lesson.duration_minutes && lesson.duration_minutes > 0 && (
                          <span className="text-xs text-slate-600">{lesson.duration_minutes}m</span>
                        )}
                        {isEnrolled ? (
                          <Play className="h-3.5 w-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-slate-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {isEnrolled && (
                  <div className="px-6 py-4 border-t border-white/[0.06]">
                    <Link
                      href={`/sessions/${id}/learn`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 py-2.5 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/25 hover:text-white"
                    >
                      <Play className="h-4 w-4" />
                      Continue Learning
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Assignments */}
            {assignments.length > 0 && (
              <div className="rounded-2xl border border-white/[0.07] bg-[#0f172a] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <h2 className="font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    Quizzes &amp; Assignments
                  </h2>
                  <span className="text-xs text-slate-500">{assignments.length} total</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {assignments.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 px-6 py-3.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        <Award className="h-3.5 w-3.5 text-purple-400" />
                      </div>
                      <p className="flex-1 truncate text-sm text-slate-300">{a.title}</p>
                      {isEnrolled ? (
                        <Link
                          href={`/sessions/${id}/quiz/${a.id}`}
                          className="shrink-0 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
                        >
                          Take Quiz
                        </Link>
                      ) : (
                        <Lock className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar — enroll card */}
          <div className="space-y-4">
            <div className="sticky top-24 rounded-2xl border border-white/[0.07] bg-[#0f172a] p-6 shadow-[0_0_60px_rgba(99,102,241,0.08)]">
              {/* Price */}
              <div className="mb-5 text-center">
                <p
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {session.is_free
                    ? <GradientText>Free</GradientText>
                    : <span className="text-white">Paid</span>}
                </p>
                {totalHours && (
                  <p className="mt-1 text-xs text-slate-500">{totalHours} of content</p>
                )}
              </div>

              <EnrollButton sessionId={session.id} studentId={user?.id} />

              {/* What's included */}
              <div className="mt-5 space-y-2.5">
                {[
                  { icon: Play, text: `${lessons.length} video lessons` },
                  { icon: FileText, text: `${assignments.length} quiz${assignments.length !== 1 ? 'zes' : ''}` },
                  { icon: Award, text: 'Certificate of completion' },
                  { icon: BookOpen, text: 'Lifetime access' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
                    <Icon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Teacher */}
              {session.teacher && (
                <div className="mt-5 border-t border-white/[0.06] pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Your Instructor
                  </p>
                  <Link href={`/teachers/${session.teacher_id}`} className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                      {session.teacher.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {session.teacher.full_name}
                      </p>
                      <p className="text-xs text-slate-500">{session.teacher.level} level</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
