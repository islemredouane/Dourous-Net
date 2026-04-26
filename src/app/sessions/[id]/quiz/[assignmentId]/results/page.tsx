import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuizResults } from '@/components/quiz/QuizResults'

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  points: number
  explanation?: string
}

type AnswerEntry = { question_id: string; selected_index: number }

type Props = { params: Promise<{ id: string; assignmentId: string }> }

export async function generateMetadata(props: Props) {
  const { assignmentId } = await props.params
  const supabase = await createClient()
  const { data } = await supabase
    .from('assignments')
    .select('title')
    .eq('id', assignmentId)
    .single()
  return { title: data ? `Results — ${data.title}` : 'Quiz Results' }
}

export default async function QuizResultsPage(props: Props) {
  const { id: sessionId, assignmentId } = await props.params
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Fetch submission
  const { data: submission } = await supabase
    .from('assignment_submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', user.id)
    .maybeSingle()

  // No submission yet → go take the quiz
  if (!submission) redirect(`/sessions/${sessionId}/quiz/${assignmentId}`)

  // Fetch assignment for questions + title
  const { data: assignment } = await supabase
    .from('assignments')
    .select('title, questions')
    .eq('id', assignmentId)
    .single()

  if (!assignment) redirect(`/sessions/${sessionId}`)

  const questions = (assignment.questions as unknown as QuizQuestion[]) ?? []
  const answers = (submission.answers as unknown as AnswerEntry[]) ?? []

  return (
    <QuizResults
      submission={{
        score: submission.score,
        total_points: submission.total_points,
        percentage: submission.percentage,
        answers,
        graded_at: submission.graded_at,
      }}
      questions={questions}
      assignmentTitle={assignment.title}
      sessionId={sessionId}
      assignmentId={assignmentId}
    />
  )
}
