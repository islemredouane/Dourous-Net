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
    const supabase = createClient()

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setState({ user: null, profile: null, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single()

      setState({ user, profile, loading: false })
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setState({ user: null, profile: null, loading: false })
      } else {
        fetchUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}
