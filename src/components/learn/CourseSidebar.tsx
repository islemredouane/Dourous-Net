'use client'

import Link from 'next/link'
import { BookOpen, Check, Clock, FileQuestion, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/types'

interface Assignment {
  id: string
  title: string
}

interface CourseSidebarProps {
  lessons: Lesson[]
  completedIds: Set<string>
  currentLessonId: string
  sessionId: string
  assignments: Assignment[]
  className?: string
}

export function CourseSidebar({
  lessons,
  completedIds,
  currentLessonId,
  sessionId,
  assignments,
  className,
}: CourseSidebarProps) {
  const completedCount = lessons.filter((l) => completedIds.has(l.id)).length
  const totalCount = lessons.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div
      className={cn(
        'rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] overflow-hidden flex flex-col',
        className,
      )}
    >
      <div className="px-5 py-4 border-b border-[#DDE3EC]/10 bg-[#0E1526]">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#60A5FA]" />
            <h3
              className="font-bold text-white text-sm"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Course Content
            </h3>
          </div>
          <span className="font-mono text-xs font-semibold text-[#AEC6FF]">
            {pct}%
          </span>
        </div>
        <p className="font-mono text-[11px] text-[#8A94A8]">
          {completedCount} / {totalCount} lessons completed
        </p>
        <div className="mt-2.5 h-1.5 w-full rounded-full overflow-hidden bg-[#080E1D]">
          <div
            className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-[#DDE3EC]/8">
          {lessons.map((lesson, idx) => {
            const isCompleted = completedIds.has(lesson.id)
            const isCurrent = lesson.id === currentLessonId

            return (
              <li key={lesson.id}>
                <Link
                  href={`/sessions/${sessionId}/learn/${lesson.id}`}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3.5 transition-colors',
                    isCurrent
                      ? 'bg-[#162038] border-l-2 border-[#2563EB]'
                      : 'hover:bg-[#162038]/60',
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-emerald-400/35 bg-emerald-500/15">
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#3B82F6]/45 bg-[#2563EB]/20">
                        <PlayCircle className="h-3.5 w-3.5 text-[#AEC6FF]" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#DDE3EC]/15 bg-[#080E1D]">
                        <span className="font-mono text-[10px] font-semibold text-[#8A94A8]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium truncate leading-snug',
                        isCurrent
                          ? 'text-white'
                          : isCompleted
                          ? 'text-[#8A94A8]'
                          : 'text-[#DDE3EC]',
                      )}
                    >
                      {lesson.title}
                    </p>
                    {lesson.duration_minutes > 0 && (
                      <div className="mt-1 flex items-center gap-1 font-mono text-[10.5px] text-[#8A94A8]">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration_minutes} min</span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        {assignments.length > 0 && (
          <div className="border-t border-[#DDE3EC]/10 bg-[#0E1526]/70">
            <p className="px-4 py-2.5 eyebrow text-[#7F97C7]">
              Quizzes &amp; Assessments
            </p>
            <ul className="divide-y divide-[#DDE3EC]/8">
              {assignments.map((assignment) => (
                <li key={assignment.id}>
                  <Link
                    href={`/sessions/${sessionId}/quiz/${assignment.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#162038] transition-colors"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-500/10">
                      <FileQuestion className="h-3.5 w-3.5 text-emerald-300" />
                    </div>
                    <span className="truncate text-xs font-medium text-[#DDE3EC] hover:text-white">
                      {assignment.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
