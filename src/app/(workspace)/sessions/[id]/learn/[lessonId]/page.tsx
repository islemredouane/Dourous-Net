import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { LessonPageClient } from '@/components/learn/LessonPageClient'
import { BrandLogo } from '@/components/shared/BrandLogo'
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

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', user.id)
    .eq('session_id', id)
    .single()

  if (!enrollment) {
    redirect(`/sessions/${id}`)
  }

  const [{ data: session }, { data: lessonsData }, { data: progressData }, { data: assignmentsData }] =
    await Promise.all([
      supabase
        .from('sessions')
        .select('id, title, category, description')
        .eq('id', id)
        .single(),
      supabase
        .from('lessons')
        .select('*')
        .eq('session_id', id)
        .order('order_index', { ascending: true }),
      supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('student_id', user.id)
        .eq('completed', true),
      supabase
        .from('assignments')
        .select('id, title')
        .eq('session_id', id)
        .order('created_at', { ascending: true }),
    ])

  if (!session) notFound()

  const lessons = (lessonsData ?? []) as Lesson[]
  const currentLesson = lessons.find((l) => l.id === lessonId)
  if (!currentLesson) notFound()

  const completedLessonIds: string[] = (progressData ?? []).map((p) => p.lesson_id)
  const assignments = (assignmentsData ?? []) as Pick<Assignment, 'id' | 'title'>[]

  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Dedicated Distraction-Free Workspace Bar */}
      <header className="sticky top-0 z-40 border-b border-[#DDE3EC]/10 bg-[#080E1D]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href={`/sessions/${id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE3EC]/15 bg-[#121A2E] px-3 py-1.5 text-xs font-medium text-[#DDE3EC] hover:border-white hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Course Syllabus</span>
            </Link>
            <div className="h-4 w-px bg-[#DDE3EC]/15 hidden sm:block" />
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#7F97C7] truncate">
                {session.category}
              </p>
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                {session.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDE3EC]/15 px-3 py-1.5 text-xs font-medium text-[#AEC6FF] hover:border-[#3B82F6] hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="hidden md:block">
              <BrandLogo size={24} showSubtitle={false} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1360px] px-4 sm:px-8 py-6 pb-20">
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
