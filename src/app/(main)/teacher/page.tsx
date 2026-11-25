import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TeacherSessionsList } from '@/components/teacher/TeacherSessionsList'
import { SubmissionsList } from '@/components/teacher/SubmissionsList'
import { BookOpen, Clock, FileText, PlusCircle, Users } from 'lucide-react'
import Link from 'next/link'
import type { Session } from '@/types'

export const metadata: Metadata = {
  title: 'Teacher Studio',
  robots: { index: false, follow: false },
}

interface SessionWithCount extends Session {
  enrollment_count: number
}

export default async function TeacherPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: sessionsRaw } = await supabase
    .from('sessions')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  const sessions = (sessionsRaw ?? []) as Session[]

  let enrollmentCounts: Record<string, number> = {}
  if (sessions.length > 0) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('session_id')
      .in(
        'session_id',
        sessions.map((s) => s.id),
      )

    enrollmentCounts = (enrollments ?? []).reduce<Record<string, number>>(
      (acc, e) => {
        acc[e.session_id] = (acc[e.session_id] ?? 0) + 1
        return acc
      },
      {},
    )
  }

  const sessionsWithCount: SessionWithCount[] = sessions.map((s) => ({
    ...s,
    enrollment_count: enrollmentCounts[s.id] ?? 0,
  }))

  const totalStudents = Object.values(enrollmentCounts).reduce((a, b) => a + b, 0)
  const totalHours = sessions.reduce((a, s) => a + (s.duration_hours ?? 0), 0)

  const sessionIds = sessions.map((s) => s.id)
  let submissions: {
    id: string
    submission_url: string
    updated_at: string
    student: { id: string; full_name: string; email: string } | null
    session: { id: string; title: string } | null
  }[] = []

  if (sessionIds.length > 0) {
    const { data: subsRaw } = await supabase
      .from('enrollments')
      .select(
        `
        id,
        submission_url,
        updated_at,
        student:students(id, full_name, email),
        session:sessions(id, title)
      `,
      )
      .in('session_id', sessionIds)
      .not('submission_url', 'is', null)
      .order('updated_at', { ascending: false })

    submissions = (subsRaw ?? []) as typeof submissions
  }

  return (
    <div className="min-h-screen bg-[#0B1120] pt-32 pb-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-[#DDE3EC]/10">
          <div>
            <p className="eyebrow text-[#7F97C7] mb-2">Teacher Studio</p>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Manage Your Sessions
            </h1>
          </div>
          <Link
            href="/teacher/new"
            className="inline-flex items-center gap-2 h-11 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Session</span>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, label: 'Published Sessions', value: sessions.length, accent: 'text-[#AEC6FF]' },
            { icon: Users, label: 'Enrolled Students', value: totalStudents, accent: 'text-emerald-300' },
            { icon: Clock, label: 'Curriculum Hours', value: totalHours, accent: 'text-sky-300' },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] p-5 flex items-center justify-between"
            >
              <div>
                <p className="eyebrow text-[#8A94A8]">{label}</p>
                <p
                  className={`mt-2 text-3xl font-bold tabular-nums ${accent}`}
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D]">
                <Icon className={`h-4.5 w-4.5 ${accent}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Sessions List */}
        <div>
          <h2
            className="mb-4 text-xl font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Published Sessions
          </h2>
          <TeacherSessionsList sessions={sessionsWithCount} />
        </div>

        {/* Student Submissions */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Student Submissions
            </h2>
            {submissions.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3B82F6]/30 bg-[#2563EB]/15 px-2.5 py-0.5 font-mono text-xs font-semibold text-[#AEC6FF]">
                <FileText className="h-3 w-3" />
                {submissions.length}
              </span>
            )}
          </div>
          <SubmissionsList submissions={submissions} />
        </div>
      </div>
    </div>
  )
}
