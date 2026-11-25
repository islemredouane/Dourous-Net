'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from '@/lib/constants'
import { BookOpen, CheckCircle, Play, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EnrollmentWithSession } from '@/types'

interface EnrolledSessionsListProps {
  readonly enrollments: EnrollmentWithSession[]
}

const STATUS_STYLES = {
  enrolled: 'bg-[#2563EB]/15 text-[#AEC6FF] border-[#3B82F6]/30',
  in_progress: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
}

const STATUS_LABEL = {
  enrolled: 'Not started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

function EnrollmentCard({ enrollment: initial }: { enrollment: EnrollmentWithSession }) {
  const [enrollment, setEnrollment] = useState(initial)
  const [updating, setUpdating] = useState(false)

  const session = enrollment.session
  if (!session) return null

  const categoryColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS.General
  const categoryGradient = CATEGORY_GRADIENTS[session.category] ?? CATEGORY_GRADIENTS.General
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
    <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] hover:border-[#3B82F6]/35 transition-colors flex items-stretch overflow-hidden">
      <div className={`hidden sm:flex w-16 shrink-0 items-center justify-center border-r border-[#DDE3EC]/10 ${categoryGradient}`}>
        <BookOpen className="h-5 w-5 text-[#AEC6FF]" />
      </div>

      <div className="flex-1 p-5 min-w-0 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/sessions/${session.id}`}
              className="text-base font-bold text-white hover:text-[#AEC6FF] transition-colors truncate block"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {session.title}
            </Link>
            {session.teacher && (
              <p className="mt-0.5 font-mono text-[11px] text-[#8A94A8]">
                Instructor: {session.teacher.full_name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase ${categoryColor}`}>
              {session.category}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase ${statusStyle}`}>
              {STATUS_LABEL[enrollment.status]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-[#080E1D] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                enrollment.progress === 100 ? 'bg-emerald-400' : 'bg-[#2563EB]',
              )}
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
          <span className="font-mono text-xs font-semibold tabular-nums text-[#AEC6FF]">
            {enrollment.progress}%
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link
            href={`/sessions/${session.id}/learn`}
            className="inline-flex items-center gap-1.5 h-10 rounded-full px-4.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-[13px] font-semibold text-white transition-colors"
          >
            <Play className="h-3.5 w-3.5" />
            <span>{enrollment.status === 'completed' ? 'Review' : 'Continue'}</span>
          </Link>

          <Link
            href={`/sessions/${session.id}`}
            className="inline-flex items-center h-10 rounded-full px-4 border border-[#DDE3EC]/15 text-[13px] text-[#DDE3EC] hover:border-white hover:text-white transition-colors"
          >
            Syllabus
          </Link>

          {enrollment.status !== 'completed' && (
            <>
              <button
                type="button"
                disabled={updating}
                onClick={() => updateProgress(nextStep)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-mono text-[#8A94A8] hover:text-white hover:bg-[#080E1D]/60 transition-colors disabled:opacity-40"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                +25%
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => updateProgress(100)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-mono text-[#8A94A8] hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Mark Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function EnrolledSessionsList({ enrollments }: EnrolledSessionsListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const prefersReduced = useReducedMotion()

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] py-16 px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D]">
          <BookOpen className="h-6 w-6 text-[#60A5FA]" />
        </div>
        <p
          className="mb-1.5 text-lg font-bold text-white"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          No enrolled sessions yet
        </p>
        <p className="mb-6 text-sm text-[#94A3B8] max-w-sm">
          Explore our catalog to enroll in your first course and track your progress here.
        </p>
        <Link
          href="/sessions"
          className="inline-flex h-11 items-center rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-6 text-[13.5px] font-semibold text-white transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    )
  }

  const filtered = enrollments.filter((e) => {
    if (filter === 'active') return e.status !== 'completed'
    if (filter === 'completed') return e.status === 'completed'
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5">
        {[
          { id: 'all' as const, label: `All (${enrollments.length})` },
          {
            id: 'active' as const,
            label: `Active (${enrollments.filter((e) => e.status !== 'completed').length})`,
          },
          {
            id: 'completed' as const,
            label: `Completed (${enrollments.filter((e) => e.status === 'completed').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              'relative h-10 rounded-full px-4 text-xs font-mono border transition-colors',
              filter === tab.id
                ? 'border-[#2563EB] text-white'
                : 'border-[#DDE3EC]/12 bg-[#121A2E] text-[#8A94A8] hover:text-white',
            )}
          >
            {filter === tab.id && (
              <motion.span
                layoutId="dashboard-enroll-filter-pill"
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 420, damping: 32 }
                }
                className="absolute inset-0 z-0 rounded-full bg-[#2563EB]"
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] py-10 text-center text-sm text-[#94A3B8]">
          No sessions in this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  )
}
