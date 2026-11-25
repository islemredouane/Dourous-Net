import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuizBuilder } from '@/components/teacher/QuizBuilder'
import { ArrowLeft, BarChart2, ClipboardList, Users } from 'lucide-react'
import Link from 'next/link'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata() {
  return { title: 'Quiz Manager — Teacher Studio' }
}

export default async function TeacherQuizPage(props: Props) {
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

  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, title, total_points, time_limit_minutes, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })

  const assignmentList = assignments ?? []
  const assignmentIds = assignmentList.map((a) => a.id)

  type SubmissionStat = { assignment_id: string; score: number; total_points: number }
  let submissionStats: SubmissionStat[] = []
  if (assignmentIds.length > 0) {
    const { data } = await supabase
      .from('assignment_submissions')
      .select('assignment_id, score, total_points')
      .in('assignment_id', assignmentIds)
    submissionStats = (data ?? []) as SubmissionStat[]
  }

  type AssignmentStat = { count: number; avgScore: number; avgPct: number }
  const statsMap = new Map<string, AssignmentStat>()
  for (const sub of submissionStats) {
    const existing = statsMap.get(sub.assignment_id) ?? { count: 0, avgScore: 0, avgPct: 0 }
    statsMap.set(sub.assignment_id, {
      count: existing.count + 1,
      avgScore: existing.avgScore + sub.score,
      avgPct: existing.avgPct + (sub.total_points > 0 ? (sub.score / sub.total_points) * 100 : 0),
    })
  }
  for (const [id, stat] of statsMap.entries()) {
    statsMap.set(id, {
      ...stat,
      avgScore: stat.count > 0 ? stat.avgScore / stat.count : 0,
      avgPct: stat.count > 0 ? stat.avgPct / stat.count : 0,
    })
  }

  return (
    <div className="min-h-screen bg-[#0B1120] pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-5 space-y-10">
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
            Quiz Manager
          </h1>
          <p className="text-[#94A3B8] text-sm mt-2">
            Author timed multiple-choice quizzes and review cohort average scores.
          </p>
        </div>

        {assignmentList.length > 0 && (
          <div className="space-y-4">
            <h2
              className="text-lg font-bold text-white flex items-center gap-2"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              <ClipboardList className="h-5 w-5 text-[#60A5FA]" />
              Published Quizzes
            </h2>
            <div className="divide-y divide-[#DDE3EC]/10 rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] overflow-hidden">
              {assignmentList.map((a) => {
                const stat = statsMap.get(a.id)
                const createdDate = new Date(a.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
                return (
                  <div
                    key={a.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{a.title}</h3>
                        {a.time_limit_minutes > 0 && (
                          <span className="rounded-full border border-[#3B82F6]/30 bg-[#2563EB]/15 px-2.5 py-0.5 font-mono text-[10px] text-[#AEC6FF]">
                            {a.time_limit_minutes} min
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-[#8A94A8]">
                        {a.total_points} pts · Created {createdDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 shrink-0">
                      {stat ? (
                        <>
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <Users className="h-3.5 w-3.5 text-[#7F97C7]" />
                            <span className="text-white">{stat.count}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <BarChart2 className="h-3.5 w-3.5 text-[#7F97C7]" />
                            <span
                              className={
                                stat.avgPct >= 70
                                  ? 'text-emerald-400'
                                  : stat.avgPct >= 50
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                              }
                            >
                              {Math.round(stat.avgPct)}% avg
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-[#8A94A8]">No attempts yet</span>
                      )}
                      <Link
                        href={`/sessions/${sessionId}/quiz/${a.id}`}
                        className="font-mono text-xs text-[#AEC6FF] hover:text-white transition-colors"
                      >
                        Preview →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div>
          <h2
            className="text-lg font-bold text-white mb-5 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            <ClipboardList className="h-5 w-5 text-[#60A5FA]" />
            {assignmentList.length === 0 ? 'Create Your First Quiz' : 'Add Another Quiz'}
          </h2>
          <QuizBuilder sessionId={sessionId} />
        </div>
      </div>
    </div>
  )
}
