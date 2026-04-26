import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Props = { params: Promise<{ id: string }> }

export default async function LearnRedirectPage(props: Props) {
  const { id } = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth?next=/sessions/${id}/learn`)
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

  // Fetch all lessons ordered
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, order_index')
    .eq('session_id', id)
    .order('order_index', { ascending: true })

  if (!lessons || lessons.length === 0) {
    redirect(`/sessions/${id}`)
  }

  // Fetch completed lesson IDs for this student
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', user.id)
    .eq('completed', true)

  const completedSet = new Set((progress ?? []).map((p) => p.lesson_id))

  // Find first incomplete lesson; fall back to first lesson
  const firstIncomplete = lessons.find((l) => !completedSet.has(l.id))
  const targetLesson = firstIncomplete ?? lessons[0]

  redirect(`/sessions/${id}/learn/${targetLesson.id}`)
}
