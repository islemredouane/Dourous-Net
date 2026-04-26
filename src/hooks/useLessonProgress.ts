'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useLessonProgress(
  studentId: string,
  sessionId: string,
  totalLessons: number,
  initialCompleted: string[] = [],
) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(initialCompleted),
  )
  const [loading, setLoading] = useState(!initialCompleted.length)

  useEffect(() => {
    if (!studentId) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('student_id', studentId)
      .eq('completed', true)
      .then(({ data }) => {
        setCompletedIds(new Set((data ?? []).map((r) => r.lesson_id)))
        setLoading(false)
      })
  }, [studentId, sessionId])

  const markComplete = useCallback(
    async (lessonId: string) => {
      if (!studentId || completedIds.has(lessonId)) return
      const supabase = createClient()

      await supabase.from('lesson_progress').upsert(
        {
          student_id: studentId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,lesson_id' },
      )

      const newCompleted = new Set(completedIds)
      newCompleted.add(lessonId)
      setCompletedIds(newCompleted)

      // Update enrollment progress percentage + status
      const pct = Math.round((newCompleted.size / Math.max(totalLessons, 1)) * 100)
      const status = pct >= 100 ? 'completed' : 'in_progress'
      await supabase
        .from('enrollments')
        .update({ progress: pct, status })
        .eq('student_id', studentId)
        .eq('session_id', sessionId)
    },
    [studentId, sessionId, completedIds, totalLessons],
  )

  return { completedIds, markComplete, loading }
}
