'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Student } from '@/types'
import type { User } from '@supabase/supabase-js'

interface UserState {
  user: User | null
  profile: Student | null
  loading: boolean
}

export function useUser(): UserState {
  const [state, setState] = useState<UserState>({
    user: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    let active = true
    const supabase = createClient()

    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          if (active) setState({ user: null, profile: null, loading: false })
          return
        }

        const authResult = await Promise.race([
          supabase.auth.getUser(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
        ])
        const user = authResult?.data?.user ?? null

        if (!user) {
          if (active) setState({ user: null, profile: null, loading: false })
          return
        }

        const { data: profile } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single()

        if (active) setState({ user, profile, loading: false })
      } catch {
        if (active) setState({ user: null, profile: null, loading: false })
      }
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        if (active) setState({ user: null, profile: null, loading: false })
      } else {
        fetchUser()
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return state
}
