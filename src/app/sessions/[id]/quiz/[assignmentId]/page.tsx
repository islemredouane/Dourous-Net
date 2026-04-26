import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuizTaker } from '@/components/quiz/QuizTaker'
import type { Database } from '@/types/database'

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

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Fetch assignment
  const { data: assignment } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', assignmentId)
    .eq('session_id', sessionId)
    .single()

  if (!assignment) notFound()

  // Parse questions JSONB
  const questions = (assignment.questions as unknown as QuizQuestion[]) ?? []

  // Check for existing submission
  const { data: existingSubmission } = await supabase
    .from('assignment_submissions')
    .select('score, total_points, percentage')
    .eq('assignment_id', assignmentId)
    .eq('student_id', user.id)
    .maybeSingle()

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
