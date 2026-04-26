'use client'

import { useEnrollment } from '@/hooks/useEnrollment'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, LogIn } from 'lucide-react'
import Link from 'next/link'

interface EnrollButtonProps {
  readonly sessionId: string
  readonly studentId?: string
}

export function EnrollButton({ sessionId, studentId }: EnrollButtonProps) {
  const { enrollment, loading, enrolling, enroll } = useEnrollment(sessionId, studentId)

  if (!studentId) {
    return (
      <Link href="/auth">
        <Button size="lg" className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-md">
          <LogIn className="mr-2 h-4 w-4" />
          Sign in to Enroll
        </Button>
      </Link>
    )
  }

  if (loading) {
    return (
      <Button size="lg" disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading…
      </Button>
    )
  }

  if (enrollment) {
    return (
      <div className="space-y-2">
        <Button
          size="lg"
          disabled
          className="w-full bg-green-600/20 border border-green-500/30 text-green-400 cursor-default"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Enrolled — {enrollment.status === 'completed' ? '✓ Completed' : `${enrollment.progress}% progress`}
        </Button>
        <Link href="/dashboard">
          <Button size="sm" variant="ghost" className="w-full text-slate-500 hover:text-white text-xs">
            Go to Dashboard →
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <Button
      size="lg"
      onClick={enroll}
      disabled={enrolling}
      className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-md hover:shadow-glow-lg transition-all"
    >
      {enrolling ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enrolling…</>
      ) : (
        'Enroll Now — Free'
      )}
    </Button>
  )
}
