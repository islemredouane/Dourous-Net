import Link from 'next/link'
import { CATEGORY_COLORS } from '@/lib/constants'
import {
  BookOpen,
  ClipboardList,
  Clock,
  ExternalLink,
  PlusCircle,
  Users,
} from 'lucide-react'
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
      <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] py-16 px-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D]">
          <BookOpen className="h-6 w-6 text-[#60A5FA]" />
        </div>
        <p
          className="mb-1.5 text-lg font-bold text-white"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          No sessions published yet
        </p>
        <p className="mb-6 text-sm text-[#94A3B8]">
          Create your first course session to add video lessons and quizzes.
        </p>
        <Link
          href="/teacher/new"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-5 text-xs font-semibold text-white transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Session</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#DDE3EC]/10 rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] overflow-hidden">
      {sessions.map((session) => {
        const catColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS.General
        return (
          <div
            key={session.id}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center hover:bg-[#162038] transition-colors"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#1B2A55] text-[#AEC6FF]">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <h3
                  className="text-base font-bold text-white truncate"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {session.title}
                </h3>
                <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase ${catColor}`}>
                  {session.category}
                </span>
                {session.is_free && (
                  <span className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] uppercase text-emerald-300">
                    Free
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 font-mono text-xs text-[#8A94A8]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#7F97C7]" />
                  {session.duration_hours}h
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#7F97C7]" />
                  {session.enrollment_count} enrolled
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href={`/teacher/sessions/${session.id}/lessons`}
                className="inline-flex items-center gap-1.5 h-10 rounded-full px-4.5 border border-[#DDE3EC]/15 bg-[#080E1D] text-[13px] font-medium text-[#DDE3EC] hover:border-[#3B82F6] hover:text-white transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#60A5FA]" />
                <span>Lessons</span>
              </Link>
              <Link
                href={`/teacher/sessions/${session.id}/quiz`}
                className="inline-flex items-center gap-1.5 h-10 rounded-full px-4.5 border border-[#DDE3EC]/15 bg-[#080E1D] text-[13px] font-medium text-[#DDE3EC] hover:border-emerald-400/60 hover:text-white transition-colors"
              >
                <ClipboardList className="h-3.5 w-3.5 text-emerald-400" />
                <span>Quizzes</span>
              </Link>
              <Link
                href={`/sessions/${session.id}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDE3EC]/15 text-[#8A94A8] hover:border-[#DDE3EC]/40 hover:text-white transition-colors"
                title="View public session page"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
