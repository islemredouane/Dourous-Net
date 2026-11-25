'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Loader2, Plus, Trash2 } from 'lucide-react'

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

    if (!title.trim()) {
      setError('Quiz title is required.')
      return
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required.`)
        return
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          setError(`All 4 options for question ${i + 1} are required.`)
          return
        }
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
    if (insertError) {
      setError(insertError.message)
      return
    }

    setSaved(true)
    router.refresh()
    setTimeout(() => {
      setSaved(false)
      onSuccess?.()
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-6 space-y-4">
        <h3
          className="text-base font-bold text-white"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Quiz Configuration
        </h3>

        <div className="space-y-1.5">
          <Label className="eyebrow text-[#8A94A8]">Quiz Title *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chapter 1 — Fundamentals Quiz"
            className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="eyebrow text-[#8A94A8]">Description (optional)</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief instructions or context for students…"
            rows={3}
            className="w-full rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D] text-white text-sm placeholder:text-[#8A94A8] px-3.5 py-2.5 focus:outline-none focus:border-[#3B82F6] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="eyebrow text-[#8A94A8]">
            Time Limit (minutes · 0 = untimed)
          </Label>
          <Input
            type="number"
            min={0}
            max={300}
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
            className="h-10 w-36 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white focus-visible:border-[#3B82F6] focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={q.id} className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#3B82F6]/35 bg-[#2563EB]/15 font-mono text-xs font-bold text-[#AEC6FF]">
                  {String(qi + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-semibold text-white">Question {qi + 1}</span>
              </div>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="eyebrow text-[#8A94A8]">Question *</Label>
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                placeholder="Type your question here…"
                rows={2}
                className="w-full rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D] text-white text-sm placeholder:text-[#8A94A8] px-3.5 py-2.5 focus:outline-none focus:border-[#3B82F6] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="eyebrow text-[#8A94A8]">
                Answer Options * (Click letter to mark correct)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, oi) => {
                  const isCorrect = q.correct_index === oi
                  return (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuestion(qi, { correct_index: oi })}
                        className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-colors ${
                          isCorrect
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                            : 'border-[#DDE3EC]/15 bg-[#080E1D] text-[#8A94A8] hover:text-white'
                        }`}
                        title={`Mark ${OPTION_LABELS[oi]} as correct`}
                      >
                        {OPTION_LABELS[oi]}
                      </button>
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                        placeholder={`Option ${OPTION_LABELS[oi]}…`}
                        className={`flex-1 h-9 rounded-lg text-sm focus-visible:ring-0 ${
                          isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                            : 'bg-[#080E1D] border-[#DDE3EC]/15 text-white'
                        } placeholder:text-[#8A94A8]`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="eyebrow text-[#8A94A8]">Points</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={q.points}
                  onChange={(e) =>
                    updateQuestion(qi, { points: Math.max(1, Number(e.target.value)) })
                  }
                  className="h-10 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white focus-visible:border-[#3B82F6] focus-visible:ring-0"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="eyebrow text-[#8A94A8]">Explanation (optional)</Label>
                <Input
                  value={q.explanation ?? ''}
                  onChange={(e) => updateQuestion(qi, { explanation: e.target.value })}
                  placeholder="Shown to students after grading"
                  className="h-10 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addQuestion}
        className="w-full rounded-xl border border-dashed border-[#DDE3EC]/20 bg-[#121A2E]/60 py-3.5 text-xs font-semibold text-[#AEC6FF] hover:border-[#3B82F6] hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add Question</span>
      </button>

      <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-[#8A94A8]">Summary</p>
          <p
            className="mt-1 text-xl font-bold text-white tabular-nums"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {totalPoints} pts{' '}
            <span className="text-xs font-normal font-mono text-[#8A94A8]">
              across {questions.length} question{questions.length !== 1 ? 's' : ''}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {error && <p className="text-xs text-red-400">{error}</p>}
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-300">
              <CheckCircle className="h-4 w-4" /> Quiz published!
            </span>
          )}
          <button
            type="submit"
            disabled={saving || saved}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-55 px-6 text-xs font-semibold text-white transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Published
              </>
            ) : (
              'Publish Quiz'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
