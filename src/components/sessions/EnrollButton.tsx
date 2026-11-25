'use client'

import { useEnrollment } from '@/hooks/useEnrollment'
import { Loader2, LogIn, Play } from 'lucide-react'
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
      <Link
        href="/auth"
        className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
      >
        <LogIn className="h-4 w-4" />
        <span>Sign in to Enroll</span>
      </Link>
    )
  }

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#162038] text-sm font-medium text-[#8A94A8]"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </button>
    )
  }

  if (enrollment) {
    return (
      <Link
        href={`/sessions/${sessionId}/learn`}
        className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
      >
        <Play className="h-4 w-4" />
        <span>{(enrollment.progress ?? 0) > 0 ? 'Continue Learning' : 'Start Learning'}</span>
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={async () => {
        const result = await enroll()
        if (!result?.error) router.push(`/sessions/${sessionId}/learn`)
      }}
      disabled={enrolling}
      className="flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors disabled:opacity-50"
    >
      {enrolling ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Enrolling...</span>
        </>
      ) : (
        <span>Enroll Now — Free</span>
      )}
    </button>
  )
}
