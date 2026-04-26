'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Enrollment } from '@/types'

export function useEnrollment(sessionId: string, studentId?: string) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    if (!studentId) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    const fetchEnrollment = async () => {
      const { data } = await supabase
        .from('enrollments')
        .select('*')
        .eq('session_id', sessionId)
        .eq('student_id', studentId)
        .maybeSingle()

      setEnrollment(data)
      setLoading(false)
    }

    fetchEnrollment()
  }, [sessionId, studentId])

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
    }

    setEnrolling(false)
    return { error }
  }, [sessionId, studentId, enrolling])

  return { enrollment, loading, enrolling, enroll }
}
