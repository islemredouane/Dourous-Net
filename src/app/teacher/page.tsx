import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/shared/GlassCard'
import { GradientText } from '@/components/shared/GradientText'
import { TeacherSessionsList } from '@/components/teacher/TeacherSessionsList'
import { Button } from '@/components/ui/button'
import { BookOpen, PlusCircle, Users, Clock, FileText } from 'lucide-react'
import Link from 'next/link'
import type { Session } from '@/types'
import { SubmissionsList } from '@/components/teacher/SubmissionsList'

export const metadata = { title: 'Teacher Portal — Dourous-Net' }

interface SessionWithCount extends Session {
  enrollment_count: number
}

export default async function TeacherPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Fetch sessions created by this teacher
  const { data: sessionsRaw } = await supabase
    .from('sessions')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  const sessions = (sessionsRaw ?? []) as Session[]

  // Fetch enrollment counts for all teacher sessions
  let enrollmentCounts: Record<string, number> = {}
  if (sessions.length > 0) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('session_id')
      .in('session_id', sessions.map((s) => s.id))

    enrollmentCounts = (enrollments ?? []).reduce<Record<string, number>>((acc, e) => {
      acc[e.session_id] = (acc[e.session_id] ?? 0) + 1
      return acc
    }, {})
  }

  const sessionsWithCount: SessionWithCount[] = sessions.map((s) => ({
    ...s,
    enrollment_count: enrollmentCounts[s.id] ?? 0,
  }))

  const totalStudents = Object.values(enrollmentCounts).reduce((a, b) => a + b, 0)
  const totalHours = sessions.reduce((a, s) => a + (s.duration_hours ?? 0), 0)

  // Fetch submissions for this teacher's sessions
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
      .select(`
        id,
        submission_url,
        updated_at,
        student:students(id, full_name, email),
        session:sessions(id, title)
      `)
      .in('session_id', sessionIds)
      .not('submission_url', 'is', null)
      .order('updated_at', { ascending: false })

    submissions = (subsRaw ?? []) as typeof submissions
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Teacher Portal
            </p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Your <GradientText>Sessions</GradientText>
            </h1>
          </div>
          <Link href="/teacher/new">
            <Button className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm hover:shadow-glow-md transition-all">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Session
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: BookOpen, label: 'Sessions', value: sessions.length, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { icon: Users, label: 'Students', value: totalStudents, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Clock, label: 'Total Hours', value: totalHours, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <GlassCard key={label} className="text-center py-5">
              <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className={`text-2xl font-bold tabular-nums ${color}`} style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                {value}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Sessions list */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Published Sessions
          </h2>
          <TeacherSessionsList sessions={sessionsWithCount} />
        </div>

        {/* Submissions */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Student Submissions
            </h2>
            {submissions.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
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
