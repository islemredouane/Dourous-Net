'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Enrollment } from '@/types'

export function useEnrollment(sessionId: string, studentId?: string) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [fetchedKey, setFetchedKey] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState(false)

  const queryKey = studentId ? `${studentId}:${sessionId}` : null
  const loading = queryKey !== null && fetchedKey !== queryKey

  useEffect(() => {
    if (!studentId || !queryKey) return

    let active = true
    const supabase = createClient()

    const fetchEnrollment = async () => {
      try {
        const { data } = await supabase
          .from('enrollments')
          .select('*')
          .eq('session_id', sessionId)
          .eq('student_id', studentId)
          .maybeSingle()

        if (!active) return
        setEnrollment(data)
      } catch {
        if (!active) return
        setEnrollment(null)
      } finally {
        if (active) setFetchedKey(queryKey)
      }
    }

    fetchEnrollment()
    return () => {
      active = false
    }
  }, [sessionId, studentId, queryKey])

  const enroll = useCallback(async () => {
    if (!studentId || enrolling) return

    setEnrolling(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('enrollments')
      .insert({ session_id: sessionId, student_id: studentId })
      .select()
      .single()

    if (!error && data) {
      setEnrollment(data as Enrollment)
      toast.success('Enrolled successfully!')
    } else if (error) {
      toast.error(`Failed to enroll: ${error.message}`)
    }

    setEnrolling(false)
    return { error }
  }, [sessionId, studentId, enrolling])

  return {
    enrollment: queryKey ? enrollment : null,
    loading,
    enrolling,
    enroll,
  }
}
