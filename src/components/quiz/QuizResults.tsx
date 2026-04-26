'use client'

import Link from 'next/link'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, ArrowLeft, RotateCcw } from 'lucide-react'

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  points: number
  explanation?: string
}

interface QuizResultsProps {
  submission: {
    score: number
    total_points: number
    percentage: number
    answers: Array<{ question_id: string; selected_index: number }>
    graded_at: string
  }
  questions: QuizQuestion[]
  assignmentTitle: string
  sessionId: string
  assignmentId: string
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function PerformanceMessage({ pct }: { pct: number }) {
  if (pct >= 90) return <p className="text-lg font-semibold text-green-400">🏆 Excellent! Outstanding performance!</p>
  if (pct >= 70) return <p className="text-lg font-semibold text-green-400">✅ Passed! Good work!</p>
  if (pct >= 50) return <p className="text-lg font-semibold text-yellow-400">⚠️ Keep practicing!</p>
  return <p className="text-lg font-semibold text-red-400">❌ Review the material and retry</p>
}

function ScoreCircle({ score, total, percentage }: { score: number; total: number; percentage: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const color =
    percentage >= 70 ? '#22c55e' : percentage >= 50 ? '#eab308' : '#ef4444'

  const passed = percentage >= 70

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold text-white leading-none"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {score}
          </span>
          <span className="text-xs text-slate-500">/ {total}</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          {percentage}%
        </p>
        <span
          className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
            passed
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}
        >
          {passed ? 'Pass' : 'Fail'}
        </span>
      </div>
    </div>
  )
}

export function QuizResults({
  submission,
  questions,
  assignmentTitle,
  sessionId,
  assignmentId,
}: QuizResultsProps) {
  const { score, total_points, percentage, answers, graded_at } = submission

  // Build answer map
  const answerMap = new Map<string, number>(answers.map((a) => [a.question_id, a.selected_index]))

  const correctCount = questions.filter(
    (q) => answerMap.get(q.id) === q.correct_index,
  ).length

  const gradedDate = new Date(graded_at).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div
      className="min-h-screen pt-20 pb-24 px-4"
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Back */}
        <Link
          href={`/sessions/${sessionId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        {/* Score hero */}
        <GlassCard className="text-center space-y-6 py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              Quiz Results
            </p>
            <h1 className="text-2xl font-bold text-white">{assignmentTitle}</h1>
            <p className="text-xs text-slate-600 mt-1">Submitted {gradedDate}</p>
          </div>

          <ScoreCircle score={score} total={total_points} percentage={percentage} />

          <PerformanceMessage pct={percentage} />

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: 'Correct', value: `${correctCount}/${questions.length}`, color: 'text-green-400' },
              { label: 'Score', value: `${score} pts`, color: 'text-indigo-400' },
              { label: 'Percentage', value: `${percentage}%`, color: percentage >= 70 ? 'text-green-400' : 'text-red-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl bg-white/5 border border-white/[0.06] p-3">
                <p className={`text-lg font-bold tabular-nums ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Per-question breakdown */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Question Review</h2>
          <div className="space-y-4">
            {questions.map((q, qi) => {
              const selectedIndex = answerMap.get(q.id) ?? -1
              const isCorrect = selectedIndex === q.correct_index
              const wasUnanswered = selectedIndex === -1

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 space-y-4 transition-all ${
                    isCorrect
                      ? 'border-green-500/20 bg-green-500/[0.04]'
                      : 'border-red-500/20 bg-red-500/[0.04]'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-1 ${
                        isCorrect
                          ? 'bg-green-500/15 text-green-400 ring-green-500/25'
                          : 'bg-red-500/15 text-red-400 ring-red-500/25'
                      }`}
                    >
                      {qi + 1}
                    </span>
                    <p className="text-white font-medium leading-relaxed text-sm pt-0.5">{q.question}</p>
                    <div className="flex-shrink-0 ml-auto">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pl-10">
                    {q.options.map((opt, oi) => {
                      const isStudentAnswer = selectedIndex === oi
                      const isCorrectAnswer = q.correct_index === oi
                      let optClass =
                        'border-white/[0.06] bg-white/[0.02] text-slate-500'
                      if (isCorrectAnswer)
                        optClass = 'border-green-500/40 bg-green-500/10 text-green-300'
                      if (isStudentAnswer && !isCorrect)
                        optClass = 'border-red-500/40 bg-red-500/10 text-red-300'

                      return (
                        <div
                          key={oi}
                          className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all ${optClass}`}
                        >
                          <span
                            className={`flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold ${
                              isCorrectAnswer
                                ? 'border-green-500 bg-green-500/20 text-green-400'
                                : isStudentAnswer && !isCorrect
                                ? 'border-red-500 bg-red-500/20 text-red-400'
                                : 'border-slate-700 text-slate-600'
                            }`}
                          >
                            {OPTION_LABELS[oi]}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isCorrectAnswer && (
                            <span className="text-xs font-medium text-green-400">Correct</span>
                          )}
                          {isStudentAnswer && !isCorrect && (
                            <span className="text-xs font-medium text-red-400">Your answer</span>
                          )}
                          {isCorrectAnswer && isStudentAnswer && (
                            <span className="text-xs font-medium text-green-400">Your answer ✓</span>
                          )}
                        </div>
                      )
                    })}

                    {wasUnanswered && (
                      <p className="text-xs text-slate-600 italic">No answer submitted</p>
                    )}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="pl-10">
                      <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2">
                        <p className="text-xs font-semibold text-indigo-400 mb-0.5">Explanation</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}

                  {/* Points earned */}
                  <div className="pl-10">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isCorrect
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCorrect ? `+${q.points}` : '0'} / {q.points} pts
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/sessions/${sessionId}`}>
            <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </Link>
          {percentage < 100 && (
            <Link href={`/sessions/${sessionId}/quiz/${assignmentId}`}>
              <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
