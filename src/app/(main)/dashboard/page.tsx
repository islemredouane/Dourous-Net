import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { EnrolledSessionsList } from '@/components/dashboard/EnrolledSessionsList'
import { ContinueLearningCard } from '@/components/dashboard/ContinueLearningCard'
import { UploadArea } from '@/components/dashboard/UploadArea'
import { ArrowRight, GraduationCap } from 'lucide-react'
import type { EnrollmentWithSession, Student } from '@/types'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const [{ data: profileRaw }, { data: enrollmentsRaw }, { data: submissionsRaw }] =
    await Promise.all([
      supabase.from('students').select('*').eq('id', user.id).single(),
      supabase
        .from('enrollments')
        .select('*, session:sessions(*, teacher:students(*))')
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false }),
      supabase
        .from('assignment_submissions')
        .select('percentage')
        .eq('student_id', user.id),
    ])

  const profile = profileRaw as Student | null
  const enrollments = (enrollmentsRaw ?? []) as EnrollmentWithSession[]
  const quizSubmissions = submissionsRaw ?? []
  const avgQuizPct =
    quizSubmissions.length > 0
      ? Math.round(
          quizSubmissions.reduce((acc, s) => acc + Number(s.percentage ?? 0), 0) /
            quizSubmissions.length,
        )
      : null

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Learner'

  const activeEnrollment =
    enrollments.find((e) => e.status === 'in_progress') ||
    enrollments.find((e) => e.status === 'enrolled') ||
    null

  return (
    <div className="min-h-screen bg-[#0B1120] pt-32 pb-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DDE3EC]/10">
          <div>
            <p className="eyebrow text-[#7F97C7] mb-2">Learning Hub</p>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {firstName}&apos;s Dashboard
            </h1>
            <p className="mt-1 font-mono text-xs text-[#8A94A8]">{user.email}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {profile?.role === 'teacher' && (
              <Link
                href="/teacher"
                className="inline-flex items-center gap-2 h-10 rounded-full px-5 border border-[#3B82F6]/35 bg-[#2563EB]/15 text-xs font-semibold text-[#AEC6FF] hover:bg-[#2563EB] hover:text-white transition-colors"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Teacher Studio</span>
              </Link>
            )}
            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 h-10 rounded-full px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Metrics */}
        <StatsCards
          enrollments={enrollments}
          quizCount={quizSubmissions.length}
          avgQuizPct={avgQuizPct}
        />

        {/* Resume Hero */}
        <ContinueLearningCard enrollment={activeEnrollment} />

        {/* Main Split */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Your Enrolled Sessions
            </h2>
            <EnrolledSessionsList enrollments={enrollments} />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Coursework &amp; PDFs
            </h2>
            <UploadArea studentId={user.id} enrollments={enrollments} />
          </div>
        </div>
      </div>
    </div>
  )
}
