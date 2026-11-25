'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle, Play, XCircle } from 'lucide-react'

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

export function QuizResults({
  submission,
  questions,
  assignmentTitle,
  sessionId,
}: QuizResultsProps) {
  const { score, total_points, percentage, answers, graded_at } = submission
  const answerMap = new Map<string, number>(
    answers.map((a) => [a.question_id, a.selected_index]),
  )
  const correctCount = questions.filter(
    (q) => answerMap.get(q.id) === q.correct_index,
  ).length

  const passed = percentage >= 70
  const gradedDate = new Date(graded_at).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="min-h-screen bg-[#0B1120] py-12 px-4 sm:px-6 pb-24">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href={`/sessions/${sessionId}`}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A94A8] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Course
        </Link>

        {/* Score Card */}
        <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-7 sm:p-10 text-center space-y-6">
          <div>
            <p className="eyebrow text-[#7F97C7] mb-1">Assessment Graded</p>
            <h1
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {assignmentTitle}
            </h1>
            <p className="font-mono text-xs text-[#8A94A8] mt-1">
              Submitted {gradedDate}
            </p>
          </div>

          <div className="py-2">
            <p
              className={`text-5xl font-bold tabular-nums ${
                passed ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-red-400'
              }`}
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {percentage}%
            </p>
            <span
              className={`mt-3 inline-block rounded-full border px-3.5 py-1 font-mono text-xs font-semibold uppercase ${
                passed
                  ? 'border-emerald-400/35 bg-emerald-500/15 text-emerald-300'
                  : 'border-red-400/35 bg-red-500/15 text-red-300'
              }`}
            >
              {passed ? 'Passed' : 'Review Recommended'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Correct', value: `${correctCount}/${questions.length}` },
              { label: 'Score', value: `${score} / ${total_points}` },
              { label: 'Grade', value: `${percentage}%` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#DDE3EC]/10 bg-[#080E1D] p-3.5">
                <p
                  className="text-lg font-bold tabular-nums text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {s.value}
                </p>
                <p className="eyebrow text-[#8A94A8] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div>
          <h2
            className="text-lg font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Question Review
          </h2>
          <div className="space-y-4">
            {questions.map((q, qi) => {
              const selectedIndex = answerMap.get(q.id) ?? -1
              const isCorrect = selectedIndex === q.correct_index

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 space-y-4 ${
                    isCorrect
                      ? 'border-emerald-500/25 bg-emerald-500/[0.04]'
                      : 'border-red-500/25 bg-red-500/[0.04]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold border ${
                        isCorrect
                          ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                          : 'border-red-400/40 bg-red-500/15 text-red-300'
                      }`}
                    >
                      {String(qi + 1).padStart(2, '0')}
                    </span>
                    <p className="text-white font-medium text-sm leading-relaxed pt-0.5 flex-1">
                      {q.question}
                    </p>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                    )}
                  </div>

                  <div className="space-y-2 sm:pl-10">
                    {q.options.map((opt, oi) => {
                      const isStudentAnswer = selectedIndex === oi
                      const isCorrectAnswer = q.correct_index === oi
                      let optClass = 'border-[#DDE3EC]/10 bg-[#080E1D] text-[#94A3B8]'
                      if (isCorrectAnswer) {
                        optClass = 'border-emerald-500/45 bg-emerald-500/10 text-emerald-200'
                      } else if (isStudentAnswer && !isCorrect) {
                        optClass = 'border-red-500/45 bg-red-500/10 text-red-200'
                      }

                      return (
                        <div
                          key={oi}
                          className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${optClass}`}
                        >
                          <span className="font-mono text-xs font-bold shrink-0">
                            {OPTION_LABELS[oi]}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isCorrectAnswer && (
                            <span className="font-mono text-[10px] uppercase text-emerald-300">
                              Correct
                            </span>
                          )}
                          {isStudentAnswer && !isCorrect && (
                            <span className="font-mono text-[10px] uppercase text-red-300">
                              Your choice
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {q.explanation && (
                    <div className="sm:pl-10">
                      <div className="rounded-xl border border-[#3B82F6]/25 bg-[#2563EB]/10 px-4 py-2.5">
                        <p className="eyebrow text-[#AEC6FF] mb-1">Explanation</p>
                        <p className="text-xs text-[#DDE3EC]/85 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/sessions/${sessionId}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#DDE3EC]/20 px-5 text-xs font-semibold text-[#DDE3EC] hover:border-white hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Course</span>
          </Link>
          <Link
            href={`/sessions/${sessionId}/learn`}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-5 text-xs font-semibold text-white transition-colors"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Continue Lessons</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
