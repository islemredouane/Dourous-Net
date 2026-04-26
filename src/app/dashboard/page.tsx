import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { EnrolledSessionsList } from '@/components/dashboard/EnrolledSessionsList'
import { UploadArea } from '@/components/dashboard/UploadArea'
import { GradientText } from '@/components/shared/GradientText'
import type { EnrollmentWithSession } from '@/types'

export const metadata = {
  title: 'Dashboard — Dourous-Net',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  // Fetch student profile
  const { data: profile } = await supabase
    .from('students')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch enrollments with session + teacher data
  const { data: enrollmentsRaw } = await supabase
    .from('enrollments')
    .select('*, session:sessions(*, teacher:students(*))')
    .eq('student_id', user.id)
    .order('enrolled_at', { ascending: false })

  const enrollments = (enrollmentsRaw ?? []) as EnrollmentWithSession[]

  const profileData = profile as { full_name?: string } | null
  const firstName = profileData?.full_name?.split(' ')[0] ?? 'Learner'

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 space-y-8">
        {/* Header */}
        <div>
          <p className="mb-1 text-sm text-slate-500">Welcome back</p>
          <h1 className="text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            <GradientText>{firstName}</GradientText>
            {"'s Dashboard"}
          </h1>
          <p className="mt-1 text-slate-500 text-sm">{user.email}</p>
        </div>

        {/* Stats */}
        <StatsCards enrollments={enrollments} />

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Enrolled sessions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Your Sessions
            </h2>
            <EnrolledSessionsList enrollments={enrollments} />
          </div>

          {/* Upload area */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Submit Work
            </h2>
            <UploadArea
              studentId={user.id}
              enrollments={enrollments}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
