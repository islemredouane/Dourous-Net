import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { GradientText } from '@/components/shared/GradientText'
import { Button } from '@/components/ui/button'
import { SessionCard } from '@/components/sessions/SessionCard'
import { ArrowRight } from 'lucide-react'
import type { SessionWithTeacher } from '@/types'

export async function CoursesPreviewSection() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sessions')
    .select('*, teacher:students(*)')
    .order('created_at', { ascending: false })
    .limit(6)

  const sessions = (data ?? []) as SessionWithTeacher[]

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionTitle
            eyebrow="Latest Sessions"
            title={<>Start Learning <GradientText>Now</GradientText></>}
            center={false}
            className="mb-0"
          />
          <Link href="/sessions" className="hidden md:block shrink-0">
            <Button
              variant="outline"
              className="glass border-indigo-500/30 text-slate-300 hover:border-indigo-400 hover:text-white"
            >
              View All Sessions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="mb-2 text-lg">No sessions yet.</p>
            <p className="text-sm">Be the first teacher to publish a session!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/sessions">
            <Button variant="outline" className="glass border-indigo-500/30 text-slate-300">
              View All Sessions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
