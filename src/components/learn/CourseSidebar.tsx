'use client'

import Link from 'next/link'
import { Check, PlayCircle, Circle, Clock, FileQuestion, BookOpen } from 'lucide-react'
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

  return (
    <div
      className={cn(
        'glass rounded-2xl overflow-hidden flex flex-col',
        className,
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <h3
            className="font-semibold text-white text-sm"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Course Content
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          {completedCount} / {totalCount} lessons completed
        </p>
        {/* Progress bar */}
        <div className="mt-2.5 h-1 w-full rounded-full bg-white/[0.06]">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{
              width: `${totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Lessons list */}
      <div className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {lessons.map((lesson) => {
            const isCompleted = completedIds.has(lesson.id)
            const isCurrent = lesson.id === currentLessonId

            return (
              <li key={lesson.id}>
                <Link
                  href={`/sessions/${sessionId}/learn/${lesson.id}`}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 transition-all duration-200',
                    isCurrent
                      ? 'bg-indigo-500/10 border-r-2 border-indigo-500'
                      : 'hover:bg-white/[0.03]',
                  )}
                >
                  {/* Status icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/40">
                        <PlayCircle className="h-3.5 w-3.5 text-indigo-400" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10">
                        <span className="text-[10px] font-medium text-slate-500">
                          {lesson.order_index + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Lesson info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium truncate leading-snug',
                        isCurrent
                          ? 'text-indigo-300'
                          : isCompleted
                            ? 'text-slate-400'
                            : 'text-slate-300',
                      )}
                    >
                      {lesson.title}
                    </p>
                    {lesson.duration_minutes > 0 && (
                      <div className="mt-0.5 flex items-center gap-1 text-slate-600">
                        <Clock className="h-3 w-3" />
                        <span className="text-[11px]">
                          {lesson.duration_minutes} min
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Assignments section */}
        {assignments.length > 0 && (
          <div className="border-t border-white/[0.06] py-2">
            <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Quizzes &amp; Assignments
            </p>
            <ul>
              {assignments.map((assignment) => (
                <li key={assignment.id}>
                  <Link
                    href={`/sessions/${sessionId}/quiz/${assignment.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-white/[0.03]"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30">
                      <FileQuestion className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <span className="truncate text-sm text-slate-400 hover:text-purple-300 transition-colors">
                      Quiz: {assignment.title}
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
