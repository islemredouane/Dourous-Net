'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, Award, ChevronRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  points: number
  explanation?: string
}

interface QuizTakerProps {
  assignment: {
    id: string
    title: string
    description: string | null
    questions: QuizQuestion[]
    total_points: number
    time_limit_minutes: number
  }
  studentId: string
  sessionId: string
  existingSubmission?: { score: number; total_points: number; percentage: number } | null
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function QuizTaker({ assignment, studentId, sessionId, existingSubmission }: QuizTakerProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(
    assignment.time_limit_minutes > 0 ? assignment.time_limit_minutes * 60 : null,
  )
  const [timerExpired, setTimerExpired] = useState(false)

  const questions = assignment.questions
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length
  const isTimerRunning = timeLeft !== null && !timerExpired && !submitting

  const handleSubmit = useCallback(
    async (autoSubmit = false) => {
      if (!autoSubmit && !allAnswered) return
      if (
        !autoSubmit &&
        !window.confirm(
          `You've answered ${answeredCount}/${questions.length} questions. Submit now?`,
        )
      )
        return

      setSubmitting(true)
      setError(null)

      // Grade
      let score = 0
      const answersPayload = questions.map((q) => {
        const selected = answers[q.id] ?? -1
        if (selected === q.correct_index) score += q.points
        return { question_id: q.id, selected_index: selected }
      })

      const percentage = Math.round((score / assignment.total_points) * 100)

      const supabase = createClient()
      const { error: insertError } = await supabase.from('assignment_submissions').insert({
        assignment_id: assignment.id,
        student_id: studentId,
        answers: answersPayload as unknown as import('@/types/database').Json,
        score,
        total_points: assignment.total_points,
        percentage,
      })

      if (insertError) {
        setSubmitting(false)
        setError(insertError.message)
        return
      }

      router.push(`/sessions/${sessionId}/quiz/${assignment.id}/results`)
    },
    [answers, allAnswered, answeredCount, questions, assignment, studentId, sessionId, router],
  )

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timerExpired || submitting) return
    if (timeLeft <= 0) {
      setTimerExpired(true)
      handleSubmit(true)
      return
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft, timerExpired, submitting, handleSubmit])

  // --- Already submitted ---
  if (existingSubmission) {
    const pct = existingSubmission.percentage
    const passed = pct >= 70
    return (
      <div
        className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        <GlassCard className="max-w-md w-full text-center space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-indigo-500/20 ring-2 ring-indigo-500/30">
            <Award className="h-8 w-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Already Submitted</h2>
            <p className="text-slate-400 text-sm">You've already completed this quiz.</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-1">
            <p className="text-4xl font-bold text-white tabular-nums">
              {existingSubmission.score}
              <span className="text-lg text-slate-500 font-normal">/{existingSubmission.total_points}</span>
            </p>
            <p
              className={`text-lg font-semibold ${passed ? 'text-green-400' : 'text-red-400'}`}
            >
              {pct}% — {passed ? 'Passed' : 'Failed'}
            </p>
          </div>
          <Link href={`/sessions/${sessionId}/quiz/${assignment.id}/results`}>
            <Button className="w-full bg-indigo-500 text-white hover:bg-indigo-600">
              View Detailed Results
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  const isTimerCritical = timeLeft !== null && timeLeft <= 60

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-[#030712]/90 backdrop-blur-xl border-b border-white/5 py-3 px-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 truncate">
              Quiz
            </p>
            <h1 className="text-base font-bold text-white truncate">{assignment.title}</h1>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Progress pill */}
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
              <CheckCircle className="h-3 w-3 text-indigo-400" />
              {answeredCount}/{questions.length} answered
            </span>
            {/* Timer */}
            {timeLeft !== null && (
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold transition-colors ${
                  isTimerCritical
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400 animate-pulse'
                    : 'bg-white/5 border border-white/10 text-slate-300'
                }`}
              >
                <Clock className="h-3 w-3" />
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-8 space-y-6">
        {/* Quiz meta */}
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>{questions.length} questions</span>
          <span>·</span>
          <span>{assignment.total_points} points total</span>
          {assignment.time_limit_minutes > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {assignment.time_limit_minutes} min limit
              </span>
            </>
          )}
        </div>

        {assignment.description && (
          <p className="text-slate-400 text-sm leading-relaxed">{assignment.description}</p>
        )}

        {/* Questions */}
        {questions.map((q, qi) => {
          const selected = answers[q.id]
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-6 space-y-5 transition-all"
            >
              {/* Question header */}
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-bold text-indigo-400 ring-1 ring-indigo-500/25">
                  {qi + 1}
                </span>
                <p className="text-white font-medium leading-relaxed pt-0.5">{q.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pl-12">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all flex items-center gap-3 group ${
                        isSelected
                          ? 'border-indigo-500/60 bg-indigo-500/15 text-white'
                          : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-200'
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-500 text-white'
                            : 'border-slate-600 text-slate-500 group-hover:border-slate-400'
                        }`}
                      >
                        {OPTION_LABELS[oi]}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isSelected && (
                        <CheckCircle className="flex-shrink-0 h-4 w-4 text-indigo-400" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Points badge */}
              <div className="pl-12">
                <span className="text-xs text-slate-600">{q.points} point{q.points !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )
        })}

        {/* Submit area */}
        <div className="sticky bottom-6">
          <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white font-medium">
                {allAnswered
                  ? 'All questions answered — ready to submit!'
                  : `${questions.length - answeredCount} question${questions.length - answeredCount !== 1 ? 's' : ''} remaining`}
              </p>
              {!allAnswered && (
                <p className="text-xs text-slate-500 mt-0.5">Answer all questions to submit</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {error && (
                <p className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </p>
              )}
              <Button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={submitting || !allAnswered}
                className="bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 px-6 h-10 shadow-lg shadow-indigo-500/20 transition-all"
              >
                {submitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    Submitting…
                  </>
                ) : (
                  'Submit Quiz'
                )}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
