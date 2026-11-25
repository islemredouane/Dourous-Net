import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { SubjectsExplorerSection } from '@/components/sections/SubjectsExplorerSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { CoursesPreviewSection } from '@/components/sections/CoursesPreviewSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { CtaSection } from '@/components/sections/CtaSection'
import { StudentMemberHome } from '@/components/home/StudentMemberHome'
import {
  TeacherMemberHome,
  type TeacherSessionSummary,
} from '@/components/home/TeacherMemberHome'
import type {
  EnrollmentWithSession,
  Session,
  SessionWithTeacher,
  Student,
} from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const [{ data: profileRaw }, { data: catalogRaw }] = await Promise.all([
      supabase.from('students').select('*').eq('id', user.id).single(),
      supabase
        .from('sessions')
        .select('*, teacher:students(*)')
        .order('created_at', { ascending: false })
        .limit(12),
    ])

    const profile = profileRaw as Student | null
    const catalogSessions = (catalogRaw ?? []) as SessionWithTeacher[]

    if (profile?.role === 'teacher') {
      const { data: ownRaw } = await supabase
        .from('sessions')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })

      const own = (ownRaw ?? []) as Session[]
      const ownIds = own.map((s) => s.id)

      const counts: Record<string, number> = {}
      let submissionsCount = 0
      if (ownIds.length > 0) {
        const { data: enrRows } = await supabase
          .from('enrollments')
          .select('session_id, submission_url')
          .in('session_id', ownIds)

        for (const row of enrRows ?? []) {
          counts[row.session_id] = (counts[row.session_id] ?? 0) + 1
          if (row.submission_url) submissionsCount += 1
        }
      }

      const ownWithCount: TeacherSessionSummary[] = own.map((s) => ({
        ...s,
        enrollment_count: counts[s.id] ?? 0,
      }))
      const totalLearners = Object.values(counts).reduce((a, b) => a + b, 0)

      return (
        <TeacherMemberHome
          profile={profile}
          email={user.email ?? profile.email ?? ''}
          ownSessions={ownWithCount}
          totalLearners={totalLearners}
          submissionsCount={submissionsCount}
          catalogSessions={catalogSessions}
        />
      )
    }

    const [{ data: enrollmentsRaw }, { data: subsRaw }] = await Promise.all([
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

    const enrollments = (enrollmentsRaw ?? []) as EnrollmentWithSession[]
    const subs = subsRaw ?? []
    const avgQuizPct =
      subs.length > 0
        ? Math.round(
            subs.reduce((acc, s) => acc + Number(s.percentage ?? 0), 0) / subs.length,
          )
        : null

    return (
      <StudentMemberHome
        profile={profile}
        email={user.email ?? profile?.email ?? ''}
        enrollments={enrollments}
        avgQuizPct={avgQuizPct}
        catalogSessions={catalogSessions}
      />
    )
  }

  // Guest visitor showcase
  const [sessionsRes, lessonsRes, quizzesRes, teachersRes] = await Promise.all([
    supabase.from('sessions').select('id, category, teacher_id'),
    supabase.from('lessons').select('id', { count: 'exact', head: true }),
    supabase.from('assignments').select('id', { count: 'exact', head: true }),
    supabase.from('students').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
  ])

  const allSessions = sessionsRes.data ?? []
  const categoryCounts: Record<string, number> = {}
  const uniqueTeachersFromSessions = new Set<string>()

  for (const s of allSessions) {
    categoryCounts[s.category] = (categoryCounts[s.category] ?? 0) + 1
    if (s.teacher_id) uniqueTeachersFromSessions.add(s.teacher_id)
  }

  const sessionsCount = allSessions.length
  const teachersCount = Math.max(teachersRes.count ?? 0, uniqueTeachersFromSessions.size)
  const lessonsCount = lessonsRes.count ?? 0
  const quizzesCount = quizzesRes.count ?? 0

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <SubjectsExplorerSection categoryCounts={categoryCounts} />
      <StatsSection
        sessionsCount={sessionsCount}
        teachersCount={teachersCount}
        lessonsCount={lessonsCount}
        quizzesCount={quizzesCount}
      />
      <CoursesPreviewSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
