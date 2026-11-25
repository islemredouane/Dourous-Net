'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { SessionCard } from '@/components/sessions/SessionCard'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionWithTeacher } from '@/types'

const PREVIEW_TABS = [
  { id: 'all', label: 'All Sessions' },
  { id: 'Computer Science', label: 'Computer Science' },
  { id: 'Mathematics', label: 'Mathematics' },
  { id: 'Physics', label: 'Physics & Chemistry' },
  { id: 'Languages', label: 'Languages & History' },
]

export function CoursesPreviewTabs({
  sessions,
  tone = 'light',
  layoutId = 'home-catalog-tab-pill',
}: {
  readonly sessions: SessionWithTeacher[]
  readonly tone?: 'light' | 'dark'
  readonly layoutId?: string
}) {
  const [tab, setTab] = useState('all')
  const prefersReduced = useReducedMotion()
  const isDark = tone === 'dark'

  const filtered = useMemo(() => {
    if (tab === 'all') return sessions.slice(0, 6)
    if (tab === 'Physics') {
      return sessions
        .filter((s) => s.category === 'Physics' || s.category === 'Chemistry')
        .slice(0, 6)
    }
    if (tab === 'Languages') {
      return sessions
        .filter((s) => s.category === 'Languages' || s.category === 'History')
        .slice(0, 6)
    }
    return sessions.filter((s) => s.category === tab).slice(0, 6)
  }, [sessions, tab])

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter featured sessions"
          className="flex flex-wrap gap-1.5"
        >
          {PREVIEW_TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  'relative h-10 rounded-full px-5 text-[13px] font-medium border transition-colors',
                  active
                    ? isDark
                      ? 'border-[#2563EB] text-white'
                      : 'border-[#0B1120] text-white'
                    : isDark
                    ? 'border-[#DDE3EC]/12 bg-[#121A2E] text-[#8A94A8] hover:border-[#3B82F6]/50 hover:text-white'
                    : 'border-[#1B2A55]/15 bg-white text-[#3A4458] hover:border-[#2563EB] hover:text-[#0B1120]',
                )}
              >
                {active && (
                  <motion.span
                    layoutId={layoutId}
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 32 }
                    }
                    className={cn(
                      'absolute inset-0 z-0 rounded-full',
                      isDark ? 'bg-[#2563EB]' : 'bg-[#0B1120]',
                    )}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            )
          })}
        </div>

        <Link
          href={
            tab === 'all' || tab === 'Physics' || tab === 'Languages'
              ? '/sessions'
              : `/sessions?category=${encodeURIComponent(tab)}`
          }
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-semibold transition-colors',
            isDark
              ? 'text-[#AEC6FF] hover:text-white'
              : 'text-[#2563EB] hover:text-[#1D4ED8]',
          )}
        >
          <span>View full catalog</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div
          className={cn(
            'rounded-2xl border py-14 px-6 text-center',
            isDark
              ? 'border-[#DDE3EC]/10 bg-[#121A2E]'
              : 'border-[#1B2A55]/12 bg-white',
          )}
        >
          <p className={cn('text-sm font-medium', isDark ? 'text-[#94A3B8]' : 'text-[#3A4458]')}>
            No published sessions in this track yet.
          </p>
          <Link
            href="/sessions"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]"
          >
            Browse all available sessions <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((session) => (
            <SessionCard key={session.id} session={session} tone={tone} />
          ))}
        </div>
      )}
    </div>
  )
}
