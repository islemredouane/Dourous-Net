import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LessonManager } from '@/components/teacher/LessonManager'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata() {
  return { title: 'Manage Lessons — Teacher Studio' }
}

export default async function TeacherLessonsPage(props: Props) {
  const { id: sessionId } = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: session } = await supabase
    .from('sessions')
    .select('id, title, teacher_id')
    .eq('id', sessionId)
    .eq('teacher_id', user.id)
    .single()

  if (!session) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, description, video_url, duration_minutes, order_index')
    .eq('session_id', sessionId)
    .order('order_index', { ascending: true })

  return (
    <div className="min-h-screen bg-[#0B1120] pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-5 space-y-8">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A94A8] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Teacher Studio
        </Link>

        <div className="pb-5 border-b border-[#DDE3EC]/10">
          <p className="eyebrow text-[#7F97C7] mb-2">Session: {session.title}</p>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Manage Lessons
          </h1>
          <p className="text-[#94A3B8] text-xs font-mono mt-2 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[#60A5FA]" />
            {lessons?.length ?? 0} lesson{(lessons?.length ?? 0) !== 1 ? 's' : ''} in curriculum
          </p>
        </div>

        <LessonManager sessionId={sessionId} initialLessons={lessons ?? []} />
      </div>
    </div>
  )
}
