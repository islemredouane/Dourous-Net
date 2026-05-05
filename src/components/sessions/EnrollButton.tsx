'use client'

import { useEnrollment } from '@/hooks/useEnrollment'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, LogIn, Play } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface EnrollButtonProps {
  readonly sessionId: string
  readonly studentId?: string
}

export function EnrollButton({ sessionId, studentId }: EnrollButtonProps) {
  const { enrollment, loading, enrolling, enroll } = useEnrollment(sessionId, studentId)
  const router = useRouter()

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
      <Link href={`/sessions/${sessionId}/learn`}>
        <Button size="lg" className="w-full bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-md">
          <Play className="mr-2 h-4 w-4" />
          {(enrollment.progress ?? 0) > 0 ? 'Continue Learning' : 'Start Learning'}
        </Button>
      </Link>
    )
  }

  return (
    <Button
      size="lg"
      onClick={async () => {
        const result = await enroll()
        if (!result?.error) router.push(`/sessions/${sessionId}/learn`)
      }}
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
