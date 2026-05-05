import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LessonManager } from '@/components/teacher/LessonManager'
import { GradientText } from '@/components/shared/GradientText'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata() {
  return { title: 'Manage Lessons — Teacher Portal' }
}

export default async function TeacherLessonsPage(props: Props) {
  const { id: sessionId } = await props.params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Verify session belongs to this teacher
  const { data: session } = await supabase
    .from('sessions')
    .select('id, title, teacher_id')
    .eq('id', sessionId)
    .eq('teacher_id', user.id)
    .single()

  if (!session) notFound()

  // Fetch existing lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, description, video_url, duration_minutes, order_index')
    .eq('session_id', sessionId)
    .order('order_index', { ascending: true })

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="mx-auto max-w-3xl px-4 space-y-8">
        {/* Back */}
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Teacher Portal
        </Link>

        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
            Session: {session.title}
          </p>
          <h1 className="text-3xl font-bold text-white">
            Manage <GradientText>Lessons</GradientText>
          </h1>
          <p className="text-slate-500 text-sm mt-2 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            {lessons?.length ?? 0} lesson{(lessons?.length ?? 0) !== 1 ? 's' : ''} in curriculum
          </p>
        </div>

        {/* Lesson Manager */}
        <LessonManager
          sessionId={sessionId}
          initialLessons={lessons ?? []}
        />
      </div>
    </div>
  )
}
