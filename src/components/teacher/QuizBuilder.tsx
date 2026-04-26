'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/shared/GlassCard'
import { Plus, Trash2, Loader2, CheckCircle } from 'lucide-react'

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  points: number
  explanation?: string
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function emptyQuestion(): QuizQuestion {
  return {
    id: crypto.randomUUID(),
    question: '',
    options: ['', '', '', ''],
    correct_index: 0,
    points: 1,
    explanation: '',
  }
}

interface QuizBuilderProps {
  sessionId: string
  onSuccess?: () => void
}

export function QuizBuilder({ sessionId, onSuccess }: QuizBuilderProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0)

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

  function updateOption(qIndex: number, optIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        const options = [...q.options]
        options[optIndex] = value
        return { ...q, options }
      }),
    )
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()])
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) { setError('Quiz title is required.'); return }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) { setError(`Question ${i + 1} text is required.`); return }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) { setError(`All 4 options for question ${i + 1} are required.`); return }
      }
    }

    setSaving(true)
    const supabase = createClient()
    const { error: insertError } = await supabase.from('assignments').insert({
      session_id: sessionId,
      title: title.trim(),
      description: description.trim() || null,
      questions: questions as unknown as import('@/types/database').Json,
      total_points: totalPoints,
      time_limit_minutes: timeLimitMinutes,
    })

    setSaving(false)
    if (insertError) { setError(insertError.message); return }

    setSaved(true)
    router.refresh()
    setTimeout(() => {
      setSaved(false)
      onSuccess?.()
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
      {/* Header info */}
      <GlassCard className="space-y-5">
        <h3 className="text-lg font-semibold text-white">Quiz Details</h3>

        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Quiz Title *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chapter 1 — Fundamentals Quiz"
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/60"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">Description (optional)</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief instructions or context for students…"
            rows={3}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 px-3 py-2 focus:outline-none focus:border-indigo-500/60 resize-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300 text-sm">
            Time Limit (minutes) — <span className="text-slate-500">0 = no time limit</span>
          </Label>
          <Input
            type="number"
            min={0}
            max={300}
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
            className="bg-white/5 border-white/10 text-white w-36 focus:border-indigo-500/60"
          />
        </div>
      </GlassCard>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <GlassCard key={q.id} className="space-y-5 relative">
            {/* Question header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/30">
                  {qi + 1}
                </span>
                <span className="text-sm font-medium text-slate-400">Question {qi + 1}</span>
              </div>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>

            {/* Question text */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Question *</Label>
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                placeholder="Type your question here…"
                rows={2}
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 px-3 py-2 focus:outline-none focus:border-indigo-500/60 resize-none transition-colors"
              />
            </div>

            {/* Options grid */}
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Answer Options *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, oi) => {
                  const isCorrect = q.correct_index === oi
                  return (
                    <div key={oi} className="relative flex items-center gap-2">
                      {/* Radio correct selector */}
                      <button
                        type="button"
                        onClick={() => updateQuestion(qi, { correct_index: oi })}
                        className={`flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                          isCorrect
                            ? 'border-green-500 bg-green-500/20 text-green-400'
                            : 'border-slate-600 text-slate-600 hover:border-slate-400'
                        }`}
                        title={`Mark ${OPTION_LABELS[oi]} as correct`}
                      >
                        {OPTION_LABELS[oi]}
                      </button>
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                        placeholder={`Option ${OPTION_LABELS[oi]}…`}
                        className={`flex-1 text-sm transition-all ${
                          isCorrect
                            ? 'bg-green-500/10 border-green-500/40 text-white focus:border-green-500/60'
                            : 'bg-white/5 border-white/10 text-white focus:border-indigo-500/60'
                        } placeholder:text-slate-600`}
                      />
                      {isCorrect && (
                        <span className="absolute right-2.5 text-green-400 text-xs font-medium">✓ Correct</span>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-slate-600">Click the letter circle to mark the correct answer</p>
            </div>

            {/* Points + Explanation row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-sm">Points</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={q.points}
                  onChange={(e) => updateQuestion(qi, { points: Math.max(1, Number(e.target.value)) })}
                  className="bg-white/5 border-white/10 text-white focus:border-indigo-500/60"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-slate-300 text-sm">Explanation (optional — shown after grading)</Label>
                <Input
                  value={q.explanation ?? ''}
                  onChange={(e) => updateQuestion(qi, { explanation: e.target.value })}
                  placeholder="Why is this the correct answer?"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/60"
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add question button */}
      <button
        type="button"
        onClick={addQuestion}
        className="w-full rounded-2xl border-2 border-dashed border-indigo-500/30 py-4 text-sm font-medium text-indigo-400 hover:border-indigo-500/60 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Question
      </button>

      {/* Footer: total points + submit */}
      <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Total Points</p>
          <p className="text-2xl font-bold text-white tabular-nums" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {totalPoints} <span className="text-sm font-normal text-slate-500">pts across {questions.length} question{questions.length !== 1 ? 's' : ''}</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {error && <p className="text-xs text-red-400">{error}</p>}
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-400">
              <CheckCircle className="h-4 w-4" /> Quiz published successfully!
            </span>
          )}
          <Button
            type="submit"
            disabled={saving || saved}
            className="bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-60 px-6 h-10 shadow-lg shadow-indigo-500/20 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing…
              </>
            ) : saved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Published!
              </>
            ) : (
              'Publish Quiz'
            )}
          </Button>
        </div>
      </GlassCard>
    </form>
  )
}
