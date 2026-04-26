import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { LessonPageClient } from '@/components/learn/LessonPageClient'
import { GradientText } from '@/components/shared/GradientText'
import type { Lesson, Assignment } from '@/types'

type Props = { params: Promise<{ id: string; lessonId: string }> }

export default async function LessonPage(props: Props) {
  const { id, lessonId } = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth?next=/sessions/${id}/learn/${lessonId}`)
  }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', user.id)
    .eq('session_id', id)
    .single()

  if (!enrollment) {
    redirect(`/sessions/${id}`)
  }

  // Fetch session info
  const { data: session } = await supabase
    .from('sessions')
    .select('id, title, category, description')
    .eq('id', id)
    .single()

  if (!session) notFound()

  // Fetch all lessons ordered
  const { data: lessonsData } = await supabase
    .from('lessons')
    .select('*')
    .eq('session_id', id)
    .order('order_index', { ascending: true })

  const lessons = (lessonsData ?? []) as Lesson[]

  // Find the current lesson
  const currentLesson = lessons.find((l) => l.id === lessonId)
  if (!currentLesson) notFound()

  // Fetch completed lesson IDs for this student (hydration seed for client hook)
  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', user.id)
    .eq('completed', true)

  const completedLessonIds: string[] = (progressData ?? []).map((p) => p.lesson_id)

  // Fetch assignments for the sidebar
  const { data: assignmentsData } = await supabase
    .from('assignments')
    .select('id, title')
    .eq('session_id', id)
    .order('created_at', { ascending: true })

  const assignments = (assignmentsData ?? []) as Pick<Assignment, 'id' | 'title'>[]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#030712' }}>
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link
            href={`/sessions/${id}`}
            className="flex items-center gap-1.5 flex-shrink-0 text-sm text-slate-500 transition-colors hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to course</span>
          </Link>
          <div className="h-4 w-px flex-shrink-0 bg-white/10" />
          <h2
            className="truncate text-sm font-semibold"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            <GradientText>{session.title}</GradientText>
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <LessonPageClient
          currentLesson={currentLesson}
          lessons={lessons}
          sessionId={id}
          studentId={user.id}
          completedLessonIds={completedLessonIds}
          assignments={assignments}
          courseTitle={session.title}
          courseDescription={session.description}
          courseCategory={session.category ?? 'General'}
        />
      </div>
    </div>
  )
}
