'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SessionWithTeacher } from '@/types'

export function useSessions(category?: string, query?: string) {
  const [sessions, setSessions] = useState<SessionWithTeacher[]>([])
  const [loading, setLoading] = useState(true)
  const [debouncedQuery, setDebouncedQuery] = useState(query ?? '')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query ?? ''), 350)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const supabase = createClient()

    const fetchSessions = async () => {
      setLoading(true)

      let q = supabase
        .from('sessions')
        .select('*, teacher:students(*)')
        .order('created_at', { ascending: false })

      if (category && category !== 'all') {
        q = q.eq('category', category)
      }

      if (debouncedQuery.trim()) {
        q = q.ilike('title', `%${debouncedQuery.trim()}%`)
      }

      const { data } = await q

      setSessions((data ?? []) as SessionWithTeacher[])
      setLoading(false)
    }

    fetchSessions()
  }, [category, debouncedQuery])

  return { sessions, loading }
}
