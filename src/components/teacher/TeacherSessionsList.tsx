import Link from 'next/link'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_COLORS } from '@/lib/constants'
import { Clock, Users, ExternalLink, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Session } from '@/types'

interface SessionWithCount extends Session {
  enrollment_count: number
}

interface TeacherSessionsListProps {
  readonly sessions: SessionWithCount[]
}

export function TeacherSessionsList({ sessions }: TeacherSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <GlassCard className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl">
          📚
        </div>
        <p className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          No sessions yet
        </p>
        <p className="mb-6 text-sm text-slate-500">Create your first session and start teaching.</p>
        <Link href="/teacher/new">
          <Button className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Session
          </Button>
        </Link>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const catColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS['General']
        return (
          <GlassCard key={session.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            {/* Icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-2xl">
              📖
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3
                  className="text-sm font-semibold text-white truncate"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {session.title}
                </h3>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${catColor}`}>
                  {session.category}
                </span>
                {session.is_free && (
                  <span className="inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                    Free
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-indigo-400" />
                  {session.duration_hours}h
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-indigo-400" />
                  {session.enrollment_count} enrolled
                </span>
              </div>
            </div>

            {/* View link */}
            <Link
              href={`/sessions/${session.id}`}
              className="shrink-0 text-slate-500 hover:text-indigo-400 transition-colors"
              title="View session"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </GlassCard>
        )
      })}
    </div>
  )
}
