'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from '@/lib/constants'
import { BookOpen, CheckCircle, Play, TrendingUp } from 'lucide-react'
import type { EnrollmentWithSession } from '@/types'

interface EnrolledSessionsListProps {
  readonly enrollments: EnrollmentWithSession[]
}

const STATUS_STYLES = {
  enrolled: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  in_progress: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
}

const STATUS_LABEL = {
  enrolled: 'Not started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100
      ? 'from-emerald-500 to-emerald-400'
      : value >= 50
      ? 'from-indigo-500 to-purple-500'
      : 'from-indigo-500/70 to-indigo-500'

  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function EnrollmentCard({ enrollment: initial }: { enrollment: EnrollmentWithSession }) {
  const [enrollment, setEnrollment] = useState(initial)
  const [updating, setUpdating] = useState(false)

  const session = enrollment.session
  if (!session) return null

  const categoryColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS['General']
  const categoryGradient = CATEGORY_GRADIENTS[session.category] ?? CATEGORY_GRADIENTS['General']
  const statusStyle = STATUS_STYLES[enrollment.status]
  const nextStep = Math.min(enrollment.progress + 25, 100)

  const updateProgress = async (newProgress: number) => {
    setUpdating(true)
    const supabase = createClient()
    const newStatus =
      newProgress === 100
        ? ('completed' as const)
        : newProgress > 0
        ? ('in_progress' as const)
        : ('enrolled' as const)

    const { data } = await supabase
      .from('enrollments')
      .update({ progress: newProgress, status: newStatus })
      .eq('id', enrollment.id)
      .select('*, session:sessions(*, teacher:students(*))')
      .single()

    if (data) setEnrollment(data as EnrollmentWithSession)
    setUpdating(false)
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f172a] transition-all duration-300 hover:border-white/[0.12]">
      <div className="flex items-stretch">
        {/* Color stripe + icon */}
        <div className={`relative flex w-16 shrink-0 flex-col items-center justify-center ${categoryGradient}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <BookOpen className="h-4 w-4 text-white/80" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-3 p-4 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="truncate text-sm font-semibold text-white"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {session.title}
              </h3>
              {session.teacher && (
                <p className="mt-0.5 text-xs text-slate-500">by {session.teacher.full_name}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${categoryColor}`}>
                {session.category}
              </span>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyle}`}>
                {STATUS_LABEL[enrollment.status]}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <ProgressBar value={enrollment.progress} />
            <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-400">
              {enrollment.progress}%
            </span>
          </div>

          {/* Actions */}
          {enrollment.status !== 'completed' ? (
            <div className="flex items-center gap-2 pt-1">
              <Link href={`/sessions/${session.id}/learn`}>
                <Button
                  size="sm"
                  className="h-7 gap-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-3 text-xs text-indigo-300 hover:bg-indigo-500/25 hover:text-white"
                >
                  <Play className="h-3 w-3" />
                  Continue
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                disabled={updating}
                onClick={() => updateProgress(nextStep)}
                className="h-7 rounded-lg px-3 text-xs text-slate-500 hover:text-white hover:bg-white/5"
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                +25%
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={updating}
                onClick={() => updateProgress(100)}
                className="h-7 rounded-lg px-3 text-xs text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10"
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                Done
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pt-1 text-xs text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5" />
              Completed — great work!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function EnrolledSessionsList({ enrollments }: EnrolledSessionsListProps) {
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#0f172a] py-14 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <BookOpen className="h-6 w-6 text-indigo-400" />
        </div>
        <p className="mb-1 text-sm font-medium text-slate-300">No sessions yet</p>
        <p className="mb-4 text-xs text-slate-600">Start your learning journey today</p>
        <Link
          href="/sessions"
          className="rounded-xl bg-indigo-500/15 border border-indigo-500/30 px-4 py-2 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-500/25 hover:text-white"
        >
          Browse sessions →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {enrollments.map((enrollment) => (
        <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  )
}
