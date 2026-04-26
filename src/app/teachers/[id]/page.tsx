import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SessionCard } from '@/components/sessions/SessionCard'
import { GlassCard } from '@/components/shared/GlassCard'
import { GradientText } from '@/components/shared/GradientText'
import { ArrowLeft, BookOpen, User } from 'lucide-react'
import Link from 'next/link'
import type { SessionWithTeacher } from '@/types'
import type { Student } from '@/types'

type Props = { params: Promise<{ id: string }> }

export default async function TeacherProfilePage(props: Props) {
  const { id } = await props.params
  const supabase = await createClient()

  const { data: teacherRaw } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()

  if (!teacherRaw) notFound()
  const teacher = teacherRaw as Student

  const { data: sessionsRaw } = await supabase
    .from('sessions')
    .select('*, teacher:students(*)')
    .eq('teacher_id', id)
    .order('created_at', { ascending: false })

  const sessions = (sessionsRaw ?? []) as SessionWithTeacher[]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 space-y-8">
        {/* Back */}
        <Link
          href="/sessions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </Link>

        {/* Teacher profile */}
        <GlassCard className="flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-glow-md">
            {teacher.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="mb-1 text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              <GradientText>{teacher.full_name}</GradientText>
            </h1>
            <p className="mb-2 text-sm text-slate-400">{teacher.email}</p>
            {teacher.bio && (
              <p className="max-w-xl text-sm leading-relaxed text-slate-400">{teacher.bio}</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-indigo-400" />
                {teacher.level}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                {sessions.length} session{sessions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Their sessions */}
        {sessions.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              {"Sessions by "}{teacher.full_name.split(' ')[0]}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center text-slate-500">
            <p className="text-lg">No sessions published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
