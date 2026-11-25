import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SessionCard } from '@/components/sessions/SessionCard'
import { SITE_CONFIG } from '@/lib/constants'
import { ArrowLeft, BookOpen, GraduationCap, Layers } from 'lucide-react'
import Link from 'next/link'
import type { SessionWithTeacher, Student } from '@/types'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params
  const supabase = await createClient()

  const { data } = await supabase
    .from('students')
    .select('id, full_name, field, level, bio')
    .eq('id', id)
    .single()

  if (!data) {
    return {
      title: 'Educator Not Found',
      robots: { index: false, follow: false },
    }
  }

  const educator = data as {
    id: string
    full_name: string
    field: string | null
    level: string | null
    bio: string | null
  }

  const title = educator.full_name
  const roleLabel = [educator.field, educator.level].filter(Boolean).join(' · ')
  const description =
    educator.bio?.trim() ||
    `Explore structured courses and mentorship from ${title}${roleLabel ? ` (${roleLabel})` : ''} on ${SITE_CONFIG.name}.`

  return {
    title,
    description,
    alternates: { canonical: `/teachers/${educator.id}` },
    openGraph: {
      type: 'profile',
      url: `/teachers/${educator.id}`,
      title: `${title} · ${SITE_CONFIG.name}`,
      description,
      images: [
        {
          url: '/og/teachers.jpg',
          width: 1200,
          height: 630,
          alt: `${title} — Educator dossier on ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${SITE_CONFIG.name}`,
      description,
      images: ['/og/teachers.jpg'],
    },
  }
}

export default async function TeacherProfilePage(props: Props) {
  const { id } = await props.params
  const supabase = await createClient()

  const [{ data: teacherRaw }, { data: sessionsRaw }] = await Promise.all([
    supabase.from('students').select('*').eq('id', id).single(),
    supabase
      .from('sessions')
      .select('*, teacher:students(*)')
      .eq('teacher_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!teacherRaw) notFound()
  const teacher = teacherRaw as Student
  const sessions = (sessionsRaw ?? []) as SessionWithTeacher[]

  return (
    <div className="min-h-screen bg-[#0B1120] pt-32 pb-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10 space-y-10">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-wider text-[#8A94A8]">
          <Link href="/teachers" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            All Educators
          </Link>
          <span>/</span>
          <Link href="/sessions" className="hover:text-white transition-colors">
            Catalog
          </Link>
        </div>

        {/* Instructor Dossier Card */}
        <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-7">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#1B2A55] border border-[#3B82F6]/35 text-3xl font-bold text-[#AEC6FF] overflow-hidden">
            {teacher.avatar_url ? (
              <img src={teacher.avatar_url} alt={teacher.full_name} className="h-full w-full object-cover" />
            ) : (
              teacher.full_name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="eyebrow text-[#7F97C7] mb-1.5">Instructor Dossier</p>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {teacher.full_name}
            </h1>
            <p className="mt-1 font-mono text-xs text-[#8A94A8]">{teacher.email}</p>

            {teacher.bio && (
              <p className="mt-4 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-[#DDE3EC]/80">
                {teacher.bio}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3 font-mono text-xs text-[#AEC6FF]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE3EC]/15 bg-[#080E1D] px-3.5 py-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-[#60A5FA]" />
                {teacher.field || teacher.level}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE3EC]/15 bg-[#080E1D] px-3.5 py-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#60A5FA]" />
                {sessions.length} published {sessions.length === 1 ? 'session' : 'sessions'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE3EC]/15 bg-[#080E1D] px-3.5 py-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                {teacher.level} Level
              </span>
            </div>
          </div>
        </div>

        {/* Published Courses */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Sessions by {teacher.full_name.split(' ')[0]}
            </h2>
          </div>

          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} tone="dark" />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] py-16 text-center text-[#94A3B8]">
              No sessions published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
