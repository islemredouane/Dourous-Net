'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SessionWithTeacher } from '@/types'

export type SessionSort = 'newest' | 'duration_desc' | 'duration_asc'

export function useSessions(
  category?: string,
  query?: string,
  sort: SessionSort = 'newest',
  freeOnly = false,
) {
  const [sessions, setSessions] = useState<SessionWithTeacher[]>([])
  const [loading, setLoading] = useState(true)
  const [debouncedQuery, setDebouncedQuery] = useState(query ?? '')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query ?? ''), 280)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    const fetchSessions = async () => {
      setLoading(true)
      try {
        let q = supabase.from('sessions').select('*, teacher:students(*)')

        if (category && category !== 'all') {
          q = q.eq('category', category)
        }

        if (freeOnly) {
          q = q.eq('is_free', true)
        }

        if (debouncedQuery.trim()) {
          const clean = debouncedQuery.trim().replace(/,/g, ' ')
          q = q.or(`title.ilike.%${clean}%,description.ilike.%${clean}%,category.ilike.%${clean}%`)
        }

        if (sort === 'duration_desc') {
          q = q.order('duration_hours', { ascending: false })
        } else if (sort === 'duration_asc') {
          q = q.order('duration_hours', { ascending: true })
        } else {
          q = q.order('created_at', { ascending: false })
        }

        const { data } = await q

        if (!cancelled) {
          setSessions((data ?? []) as SessionWithTeacher[])
        }
      } catch {
        if (!cancelled) {
          setSessions([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchSessions()
    return () => {
      cancelled = true
    }
  }, [category, debouncedQuery, sort, freeOnly])

  return { sessions, loading }
}
