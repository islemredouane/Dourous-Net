import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuizTaker } from '@/components/quiz/QuizTaker'

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  points: number
  explanation?: string
}

type Props = { params: Promise<{ id: string; assignmentId: string }> }

export async function generateMetadata(props: Props) {
  const { assignmentId } = await props.params
  const supabase = await createClient()
  const { data } = await supabase
    .from('assignments')
    .select('title')
    .eq('id', assignmentId)
    .single()
  return { title: data ? `${data.title} — Quiz` : 'Quiz' }
}

export default async function QuizPage(props: Props) {
  const { id: sessionId, assignmentId } = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [{ data: assignment }, { data: existingSubmission }] = await Promise.all([
    supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .eq('session_id', sessionId)
      .single(),
    supabase
      .from('assignment_submissions')
      .select('score, total_points, percentage')
      .eq('assignment_id', assignmentId)
      .eq('student_id', user.id)
      .maybeSingle(),
  ])

  if (!assignment) notFound()

  const questions = (assignment.questions as unknown as QuizQuestion[]) ?? []

  return (
    <QuizTaker
      assignment={{
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        questions,
        total_points: assignment.total_points,
        time_limit_minutes: assignment.time_limit_minutes,
      }}
      studentId={user.id}
      sessionId={sessionId}
      existingSubmission={existingSubmission ?? null}
    />
  )
}
