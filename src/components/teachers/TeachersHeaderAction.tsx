'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { ArrowRight, GraduationCap, LayoutDashboard } from 'lucide-react'

export function TeachersHeaderAction() {
  const { user, profile, loading } = useUser()
  const isTeacher = profile?.role === 'teacher'

  if (loading) {
    return (
      <div className="h-11 w-44 rounded-full bg-[#121A2E] border border-[#DDE3EC]/15 animate-pulse shrink-0 self-start lg:self-end" />
    )
  }

  if (user) {
    return (
      <Link
        href={isTeacher ? '/teacher' : '/dashboard'}
        className="inline-flex items-center gap-2 h-11 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors shrink-0 self-start lg:self-end"
      >
        {isTeacher ? (
          <>
            <GraduationCap className="h-4 w-4" />
            <span>Open Teacher Studio</span>
          </>
        ) : (
          <>
            <LayoutDashboard className="h-4 w-4" />
            <span>My Dashboard</span>
          </>
        )}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    )
  }

  return (
    <Link
      href="/auth"
      className="inline-flex items-center gap-2 h-11 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors shrink-0 self-start lg:self-end"
    >
      <span>Teach on Dourous-Net</span>
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  )
}
