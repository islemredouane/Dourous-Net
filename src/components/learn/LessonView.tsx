'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { VideoPlayer } from '@/components/learn/VideoPlayer'
import { Button } from '@/components/ui/button'
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
    // Auto-advance to next lesson after a brief moment
    if (nextLesson) {
      setTimeout(() => {
        router.push(`/sessions/${sessionId}/learn/${nextLesson.id}`)
      }, 800)
    }
  }

  const navigate = (lessonId: string) => {
    router.push(`/sessions/${sessionId}/learn/${lessonId}`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Lesson header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl font-bold text-white md:text-3xl leading-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {lesson.title}
          </h1>
          {lesson.duration_minutes > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-slate-500 text-sm">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>{lesson.duration_minutes} minutes</span>
            </div>
          )}
        </div>

        {isCompleted && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </div>
        )}
      </div>

      {/* Video player */}
      {lesson.video_url ? (
        <VideoPlayer url={lesson.video_url} title={lesson.title} />
      ) : (
        <div className="glass flex aspect-video w-full items-center justify-center rounded-2xl">
          <p className="text-slate-500">No video available for this lesson.</p>
        </div>
      )}

      {/* Description */}
      {lesson.description && (
        <div className="glass rounded-2xl p-6">
          <h2
            className="mb-3 text-base font-semibold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            About this lesson
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm">{lesson.description}</p>
        </div>
      )}

      {/* Navigation bar */}
      <div className="glass rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
        {/* Previous */}
        <Button
          variant="ghost"
          className={cn(
            'flex items-center gap-2 text-slate-400 hover:text-white transition-colors',
            !prevLesson && 'invisible pointer-events-none',
          )}
          onClick={() => prevLesson && navigate(prevLesson.id)}
          disabled={!prevLesson}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Mark complete */}
        {studentId && (
          <Button
            onClick={handleMarkComplete}
            disabled={isCompleted || marking}
            className={cn(
              'flex items-center gap-2 px-6 font-medium transition-all duration-300',
              isCompleted
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default hover:bg-emerald-500/10'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-glow-sm hover:shadow-glow-md',
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </>
            ) : marking ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Marking...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Mark as Complete
              </>
            )}
          </Button>
        )}

        {/* Next */}
        <Button
          variant="ghost"
          className={cn(
            'flex items-center gap-2 text-slate-400 hover:text-white transition-colors',
            !nextLesson && 'invisible pointer-events-none',
          )}
          onClick={() => nextLesson && navigate(nextLesson.id)}
          disabled={!nextLesson}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
