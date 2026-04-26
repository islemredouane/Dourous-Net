import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuizBuilder } from '@/components/teacher/QuizBuilder'
import { GlassCard } from '@/components/shared/GlassCard'
import { GradientText } from '@/components/shared/GradientText'
import { ArrowLeft, ClipboardList, Users, BarChart2 } from 'lucide-react'
import Link from 'next/link'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata(props: Props) {
  return { title: 'Quiz Manager — Teacher Portal' }
}

export default async function TeacherQuizPage(props: Props) {
  const { id: sessionId } = await props.params
  const supabase = await createClient()

  // Auth
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Verify session belongs to this teacher
  const { data: session } = await supabase
    .from('sessions')
    .select('id, title, teacher_id')
    .eq('id', sessionId)
    .eq('teacher_id', user.id)
    .single()

  if (!session) notFound()

  // Fetch existing assignments for this session
  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, title, total_points, time_limit_minutes, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })

  const assignmentList = assignments ?? []
  const assignmentIds = assignmentList.map((a) => a.id)

  // Fetch submission counts and scores per assignment
  type SubmissionStat = { assignment_id: string; score: number; total_points: number }
  let submissionStats: SubmissionStat[] = []
  if (assignmentIds.length > 0) {
    const { data } = await supabase
      .from('assignment_submissions')
      .select('assignment_id, score, total_points')
      .in('assignment_id', assignmentIds)
    submissionStats = (data ?? []) as SubmissionStat[]
  }

  // Build per-assignment stats
  type AssignmentStat = {
    count: number
    avgScore: number
    avgPct: number
  }
  const statsMap = new Map<string, AssignmentStat>()
  for (const sub of submissionStats) {
    const existing = statsMap.get(sub.assignment_id) ?? { count: 0, avgScore: 0, avgPct: 0 }
    statsMap.set(sub.assignment_id, {
      count: existing.count + 1,
      avgScore: existing.avgScore + sub.score,
      avgPct: existing.avgPct + (sub.total_points > 0 ? (sub.score / sub.total_points) * 100 : 0),
    })
  }
  // Finalize averages
  for (const [id, stat] of statsMap.entries()) {
    statsMap.set(id, {
      ...stat,
      avgScore: stat.count > 0 ? stat.avgScore / stat.count : 0,
      avgPct: stat.count > 0 ? stat.avgPct / stat.count : 0,
    })
  }

  return (
    <div
      className="min-h-screen pt-24 pb-16"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="mx-auto max-w-4xl px-4 space-y-10">
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
            Quiz <GradientText>Manager</GradientText>
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Create and manage quizzes for your students
          </p>
        </div>

        {/* Existing quizzes */}
        {assignmentList.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-400" />
              Published Quizzes
            </h2>
            <div className="space-y-3">
              {assignmentList.map((a) => {
                const stat = statsMap.get(a.id)
                const createdDate = new Date(a.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
                return (
                  <GlassCard key={a.id} hover className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{a.title}</h3>
                        {a.time_limit_minutes > 0 && (
                          <span className="flex-shrink-0 rounded-full bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                            {a.time_limit_minutes} min
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        {a.total_points} pts · Created {createdDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0">
                      {stat ? (
                        <>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-slate-300 font-medium">{stat.count}</span>
                            <span className="text-slate-600 text-xs">students</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <BarChart2 className="h-4 w-4 text-slate-500" />
                            <span
                              className={`font-medium ${
                                stat.avgPct >= 70
                                  ? 'text-green-400'
                                  : stat.avgPct >= 50
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                              }`}
                            >
                              {Math.round(stat.avgPct)}%
                            </span>
                            <span className="text-slate-600 text-xs">avg</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-slate-600 italic">No submissions yet</span>
                      )}
                      <Link
                        href={`/sessions/${sessionId}/quiz/${a.id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Preview →
                      </Link>
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          </div>
        )}

        {/* Divider */}
        {assignmentList.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#030712] px-4 text-xs font-medium text-slate-600 uppercase tracking-wider">
                Create New Quiz
              </span>
            </div>
          </div>
        )}

        {/* Quiz Builder */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-400" />
            {assignmentList.length === 0 ? 'Create Your First Quiz' : 'Add Another Quiz'}
          </h2>
          <QuizBuilder sessionId={sessionId} />
        </div>
      </div>
    </div>
  )
}
