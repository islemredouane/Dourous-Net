'use client'

import { SessionCard } from './SessionCard'
import { SessionGridSkeleton } from './SessionGridSkeleton'
import { SearchX } from 'lucide-react'
import type { SessionWithTeacher } from '@/types'

interface SessionGridProps {
  readonly sessions: SessionWithTeacher[]
  readonly loading?: boolean
  readonly onReset?: () => void
}

export function SessionGrid({ sessions, loading, onReset }: SessionGridProps) {
  if (loading) return <SessionGridSkeleton />

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] py-20 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D] mb-5">
          <SearchX className="h-6 w-6 text-[#7F97C7]" />
        </div>
        <p className="eyebrow text-[#7F97C7] mb-2">Catalog Registry</p>
        <h3
          className="mb-2 text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          No matching sessions found
        </h3>
        <p className="max-w-md text-sm text-[#94A3B8] mb-6">
          Try clearing your search query or switching disciplines to explore all available sessions.
        </p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="h-10 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors"
          >
            Reset all filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} tone="dark" />
      ))}
    </div>
  )
}
