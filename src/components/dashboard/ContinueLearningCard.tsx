'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { CATEGORY_COLORS } from '@/lib/constants'
import type { EnrollmentWithSession } from '@/types'

interface ContinueLearningCardProps {
  readonly enrollment: EnrollmentWithSession | null
}

export function ContinueLearningCard({ enrollment }: ContinueLearningCardProps) {
  if (!enrollment || enrollment.status === 'completed' || !enrollment.session) {
    return null
  }

  const session = enrollment.session
  const categoryColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS.General

  return (
    <div className="rounded-3xl border border-[#3B82F6]/35 bg-[#121A2E] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="eyebrow text-[#AEC6FF]">Resume Learning</span>
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider ${categoryColor}`}
          >
            {session.category}
          </span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold text-white truncate"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          {session.title}
        </h2>

        <div className="mt-4 max-w-sm">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#94A3B8]">Course Progress</span>
            <span className="font-mono font-semibold text-[#AEC6FF]">
              {enrollment.progress}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden bg-[#080E1D]">
            <div
              className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>
      </div>

      <Link
        href={`/sessions/${session.id}/learn`}
        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-7 text-sm font-semibold text-white transition-colors shrink-0"
      >
        <Play className="h-4 w-4 fill-current" />
        <span>Continue Learning</span>
      </Link>
    </div>
  )
}
