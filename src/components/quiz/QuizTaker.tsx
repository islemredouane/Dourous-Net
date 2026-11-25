'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, ArrowLeft, Award, CheckCircle, ChevronRight, Clock } from 'lucide-react'
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

export function QuizTaker({
  assignment,
  studentId,
  sessionId,
  existingSubmission,
}: QuizTakerProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(
    assignment.time_limit_minutes > 0 ? assignment.time_limit_minutes * 60 : null,
  )
  const expiredSubmittedRef = useRef(false)

  const questions = assignment.questions
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length

  const handleSubmit = useCallback(
    async (autoSubmit = false) => {
      if (!autoSubmit && !allAnswered) return
      setConfirmOpen(false)

      setSubmitting(true)
      setError(null)

      let score = 0
      const answersPayload = questions.map((q) => {
        const selected = answers[q.id] ?? -1
        if (selected === q.correct_index) score += q.points
        return { question_id: q.id, selected_index: selected }
      })

      const percentage = Math.round((score / Math.max(assignment.total_points, 1)) * 100)

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
    [answers, allAnswered, questions, assignment, studentId, sessionId, router],
  )

  useEffect(() => {
    if (timeLeft === null || submitting || existingSubmission) return
    if (timeLeft <= 0) {
      if (expiredSubmittedRef.current) return
      expiredSubmittedRef.current = true
      const timer = setTimeout(() => {
        void handleSubmit(true)
      }, 0)
      return () => clearTimeout(timer)
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? Math.max(prev - 1, 0) : null))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft, submitting, existingSubmission, handleSubmit])

  if (existingSubmission) {
    const pct = existingSubmission.percentage
    const passed = pct >= 70
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-8 text-center space-y-6">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-xl border border-[#3B82F6]/35 bg-[#2563EB]/15">
            <Award className="h-7 w-7 text-[#AEC6FF]" />
          </div>
          <div>
            <p className="eyebrow text-[#7F97C7] mb-1">Quiz Attempt Recorded</p>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Already Submitted
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              Your graded attempt is saved below.
            </p>
          </div>
          <div className="rounded-xl border border-[#DDE3EC]/10 bg-[#080E1D] p-5 space-y-1">
            <p
              className="text-4xl font-bold text-white tabular-nums"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {existingSubmission.score}
              <span className="text-lg text-[#8A94A8] font-normal">
                /{existingSubmission.total_points}
              </span>
            </p>
            <p
              className={`font-mono text-sm font-semibold ${
                passed ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {pct}% — {passed ? 'PASSED' : 'NEEDS REVIEW'}
            </p>
          </div>
          <div className="space-y-2.5">
            <Link
              href={`/sessions/${sessionId}/quiz/${assignment.id}/results`}
              className="flex w-full h-11 items-center justify-center gap-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
            >
              <span>View Detailed Breakdown</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/sessions/${sessionId}`}
              className="flex w-full h-10 items-center justify-center rounded-full border border-[#DDE3EC]/15 text-xs font-medium text-[#DDE3EC] hover:text-white transition-colors"
            >
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isTimerCritical = timeLeft !== null && timeLeft <= 60

  return (
    <div className="min-h-screen bg-[#0B1120] pb-24">
      {/* Unobstructed Sticky Workspace Quiz Header */}
      <header className="sticky top-0 z-40 bg-[#080E1D]/95 backdrop-blur-md border-b border-[#DDE3EC]/10 pt-[calc(0.875rem+var(--pwa-safe-top))] pb-3.5 px-4 sm:px-8">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/sessions/${sessionId}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE3EC]/15 bg-[#121A2E] text-[#DDE3EC] hover:text-white shrink-0"
              aria-label="Exit quiz"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="eyebrow text-[#7F97C7] truncate">Assessment</p>
              <h1
                className="text-sm sm:text-base font-bold text-white truncate"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {assignment.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E] px-3 py-1 font-mono text-xs text-[#AEC6FF]">
              <CheckCircle className="h-3.5 w-3.5" />
              {answeredCount}/{questions.length}
            </span>
            {timeLeft !== null && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-semibold ${
                  isTimerCritical
                    ? 'border-red-500/40 bg-red-500/15 text-red-400 animate-pulse'
                    : 'border-[#DDE3EC]/15 bg-[#121A2E] text-white'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-8 space-y-6">
        <div className="flex flex-wrap gap-3 font-mono text-xs text-[#8A94A8]">
          <span>{questions.length} questions</span>
          <span>·</span>
          <span>{assignment.total_points} points total</span>
          {assignment.time_limit_minutes > 0 && (
            <>
              <span>·</span>
              <span>{assignment.time_limit_minutes} min time limit</span>
            </>
          )}
        </div>

        {assignment.description && (
          <p className="text-sm text-[#94A3B8] leading-relaxed">{assignment.description}</p>
        )}

        {questions.map((q, qi) => {
          const selected = answers[q.id]
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-6 space-y-5"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-[#3B82F6]/35 bg-[#2563EB]/15 font-mono text-xs font-bold text-[#AEC6FF]">
                  {String(qi + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <p className="text-white font-semibold leading-relaxed pt-0.5">
                    {q.question}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[#8A94A8]">
                    {q.points} point{q.points !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:pl-12">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#3B82F6] bg-[#2563EB]/15 text-white'
                          : 'border-[#DDE3EC]/10 bg-[#080E1D] text-[#94A3B8] hover:border-[#DDE3EC]/30 hover:text-white'
                      }`}
                    >
                      <span
                        className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-md border font-mono text-xs font-bold ${
                          isSelected
                            ? 'border-[#3B82F6] bg-[#2563EB] text-white'
                            : 'border-[#DDE3EC]/20 text-[#8A94A8]'
                        }`}
                      >
                        {OPTION_LABELS[oi]}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isSelected && <CheckCircle className="h-4 w-4 text-[#60A5FA] shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        <div className="sticky bottom-4">
          <div className="rounded-2xl border border-[#DDE3EC]/15 bg-[#0E1526]/95 backdrop-blur-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
            <div>
              <p className="text-sm font-semibold text-white">
                {allAnswered
                  ? 'All questions answered — ready to submit.'
                  : `${questions.length - answeredCount} question${
                      questions.length - answeredCount !== 1 ? 's' : ''
                    } remaining`}
              </p>
              {!allAnswered && (
                <p className="text-xs text-[#8A94A8] mt-0.5">
                  Answer every question to unlock submission.
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {error && (
                <p className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={submitting || !allAnswered}
                className="h-11 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-45 text-sm font-semibold text-white transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-confirm-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#040711]/80 backdrop-blur-sm"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#DDE3EC]/15 bg-[#0E1526] p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="eyebrow text-[#7F97C7]">Confirm Submission</p>
              <h3
                id="quiz-confirm-title"
                className="mt-1.5 text-xl font-bold text-white"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Ready to submit this quiz?
              </h3>
              <p className="mt-2 text-sm text-[#94A3B8]">
                You&apos;ve answered{' '}
                <span className="font-semibold text-white">
                  {answeredCount} of {questions.length}
                </span>{' '}
                questions. Once submitted, your score and feedback will be generated right away.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="h-10 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E] px-5 text-[13px] font-semibold text-[#DDE3EC] hover:border-[#DDE3EC]/35 hover:text-white transition-colors"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="h-10 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 px-5 text-[13px] font-semibold text-white transition-colors"
              >
                {submitting ? 'Submitting...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
