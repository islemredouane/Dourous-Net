'use client'

import { useLessonProgress } from '@/hooks/useLessonProgress'
import { LessonView } from '@/components/learn/LessonView'
import { CourseSidebar } from '@/components/learn/CourseSidebar'
import { AICoachChat } from '@/components/learn/AICoachChat'
import type { Lesson, Assignment } from '@/types'

interface LessonPageClientProps {
  currentLesson: Lesson
  lessons: Lesson[]
  sessionId: string
  studentId: string
  completedLessonIds: string[]
  assignments: Pick<Assignment, 'id' | 'title'>[]
  courseTitle: string
  courseDescription?: string | null
  courseCategory: string
}

export function LessonPageClient({
  currentLesson,
  lessons,
  sessionId,
  studentId,
  completedLessonIds,
  assignments,
  courseTitle,
  courseDescription,
  courseCategory,
}: LessonPageClientProps) {
  const { completedIds, markComplete } = useLessonProgress(
    studentId,
    sessionId,
    lessons.length,
    completedLessonIds,
  )

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main lesson area */}
        <div className="lg:col-span-2">
          <LessonView
            lesson={currentLesson}
            lessons={lessons}
            sessionId={sessionId}
            studentId={studentId}
            completedIds={completedIds}
            markComplete={markComplete}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CourseSidebar
            lessons={lessons}
            completedIds={completedIds}
            currentLessonId={currentLesson.id}
            sessionId={sessionId}
            assignments={assignments}
            className="sticky top-[73px] max-h-[calc(100vh-100px)]"
          />
        </div>
      </div>

      {/* AI Coach — floating bottom-right */}
      <AICoachChat
        courseTitle={courseTitle}
        courseDescription={courseDescription ?? ''}
        courseCategory={courseCategory}
      />
    </>
  )
}
