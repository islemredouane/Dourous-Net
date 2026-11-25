'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { VideoPlayer } from '@/components/learn/VideoPlayer'
import { cn } from '@/lib/utils'
import type { Lesson } from '@/types'

interface LessonViewProps {
  lesson: Lesson
  lessons: Lesson[]
  sessionId: string
  studentId: string | null
  completedIds: Set<string>
  markComplete: (id: string) => Promise<void>
}

export function LessonView({
  lesson,
  lessons,
  sessionId,
  studentId,
  completedIds,
  markComplete,
}: LessonViewProps) {
  const router = useRouter()
  const [marking, setMarking] = useState(false)

  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index)
  const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null

  const isCompleted = completedIds.has(lesson.id)

  const handleMarkComplete = async () => {
    if (!studentId || isCompleted || marking) return
    setMarking(true)
    await markComplete(lesson.id)
    setMarking(false)
    if (nextLesson) {
      setTimeout(() => {
        router.push(`/sessions/${sessionId}/learn/${nextLesson.id}`)
      }, 650)
    }
  }

  const navigate = (lessonId: string) => {
    router.push(`/sessions/${sessionId}/learn/${lessonId}`)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Video */}
      {lesson.video_url ? (
        <VideoPlayer url={lesson.video_url} title={lesson.title} />
      ) : (
        <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] flex aspect-video w-full items-center justify-center">
          <p className="text-sm text-[#94A3B8]">No video provided for this lesson.</p>
        </div>
      )}

      {/* Title & Status */}
      <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-[#7F97C7] mb-1.5">
              Lesson {String(currentIndex + 1).padStart(2, '0')} of {String(sortedLessons.length).padStart(2, '0')}
            </p>
            <h1
              className="text-2xl font-bold text-white md:text-3xl leading-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {lesson.title}
            </h1>
            {lesson.duration_minutes > 0 && (
              <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-[#8A94A8]">
                <Clock className="h-3.5 w-3.5 text-[#60A5FA]" />
                <span>{lesson.duration_minutes} minutes</span>
              </div>
            )}
          </div>

          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Completed</span>
            </div>
          )}
        </div>

        {lesson.description && (
          <div className="mt-5 pt-5 border-t border-[#DDE3EC]/10">
            <h2
              className="mb-2 text-sm font-bold uppercase tracking-wider text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Lesson Overview
            </h2>
            <p className="text-sm text-[#DDE3EC]/80 leading-relaxed">
              {lesson.description}
            </p>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-4 flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => prevLesson && navigate(prevLesson.id)}
          disabled={!prevLesson}
          className={cn(
            'inline-flex items-center gap-2 h-10 rounded-full px-4 border border-[#DDE3EC]/15 text-xs font-medium text-[#DDE3EC] hover:border-white hover:text-white transition-colors',
            !prevLesson && 'invisible pointer-events-none',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {studentId && (
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={isCompleted || marking}
            className={cn(
              'inline-flex items-center gap-2 h-10 rounded-full px-6 text-xs font-semibold transition-colors',
              isCompleted
                ? 'border border-emerald-400/35 bg-emerald-500/15 text-emerald-300 cursor-default'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white',
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed</span>
              </>
            ) : marking ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark Complete</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => nextLesson && navigate(nextLesson.id)}
          disabled={!nextLesson}
          className={cn(
            'inline-flex items-center gap-2 h-10 rounded-full px-4 border border-[#DDE3EC]/15 text-xs font-medium text-[#DDE3EC] hover:border-white hover:text-white transition-colors',
            !nextLesson && 'invisible pointer-events-none',
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
