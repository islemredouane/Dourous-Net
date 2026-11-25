import { createClient } from '@/lib/supabase/server'
import {
  TeachersDirectoryClient,
  type TeacherSummary,
} from '@/components/teachers/TeachersDirectoryClient'
import { TeachersHeaderAction } from '@/components/teachers/TeachersHeaderAction'
import type { Student } from '@/types'

export const metadata = {
  title: 'Educators & Instructors',
  description:
    'Meet the Algerian professors, engineers, and educators publishing structured video sessions on Dourous-Net.',
}

export default async function TeachersPage() {
  const supabase = await createClient()

  const [{ data: sessionsRaw }, { data: teachersRaw }] = await Promise.all([
    supabase.from('sessions').select('id, teacher_id, category'),
    supabase.from('students').select('*').eq('role', 'teacher'),
  ])

  const sessionsByTeacher = new Map<string, { count: number; categories: Set<string> }>()
  for (const s of sessionsRaw ?? []) {
    const entry = sessionsByTeacher.get(s.teacher_id) ?? {
      count: 0,
      categories: new Set<string>(),
    }
    entry.count += 1
    if (s.category) entry.categories.add(s.category)
    sessionsByTeacher.set(s.teacher_id, entry)
  }

  // Also fetch any teachers referenced by sessions (e.g. demo seeded accounts)
  const teacherIds = [...sessionsByTeacher.keys()]
  let extraTeachers: Student[] = []
  if (teacherIds.length > 0) {
    const { data } = await supabase
      .from('students')
      .select('*')
      .in('id', teacherIds)
    extraTeachers = (data ?? []) as Student[]
  }

  const mergedMap = new Map<string, Student>()
  for (const t of [...((teachersRaw ?? []) as Student[]), ...extraTeachers]) {
    if (t.full_name) mergedMap.set(t.id, t)
  }

  const teachers: TeacherSummary[] = [...mergedMap.values()]
    .map((t) => {
      const info = sessionsByTeacher.get(t.id)
      return {
        ...t,
        sessionCount: info?.count ?? 0,
        categories: info ? [...info.categories] : [],
      }
    })
    .sort((a, b) => b.sessionCount - a.sessionCount)

  return (
    <div className="min-h-screen bg-[#0B1120] pb-24">
      <div className="relative pt-32 pb-14 border-b border-[#DDE3EC]/10 bg-[#080E1D] overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-[#7F97C7] mb-3">Faculty &amp; Mentors</p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Meet Our Educators
            </h1>
            <p className="mt-3 text-base text-[#94A3B8] max-w-2xl leading-relaxed">
              University professors, engineers, and educators sharing structured curricula and mentorship across Algeria.
            </p>
          </div>
          <TeachersHeaderAction />
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 md:px-10 pt-10">
        <TeachersDirectoryClient teachers={teachers} />
      </div>
    </div>
  )
}
