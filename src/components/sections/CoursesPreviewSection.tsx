import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { CoursesPreviewTabs } from './CoursesPreviewTabs'
import { ArrowRight } from 'lucide-react'
import type { SessionWithTeacher } from '@/types'

export async function CoursesPreviewSection() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sessions')
    .select('*, teacher:students(*)')
    .order('created_at', { ascending: false })
    .limit(12)

  const sessions = (data ?? []) as SessionWithTeacher[]

  return (
    <section className="bg-[#F5F6F8] text-[#0B1120] py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionTitle
            eyebrow="03 · Latest Curriculum"
            title="Start learning right now."
            subtitle="Every course includes ordered video lessons, automated progress tracking, and instructor contact."
            center={false}
            tone="light"
            className="mb-0"
          />
          <Link
            href="/sessions"
            className="inline-flex shrink-0 items-center gap-2 h-11 rounded-full px-6 border border-[#1B2A55]/20 bg-white text-sm font-medium text-[#0B1120] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            <span>All Sessions</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <CoursesPreviewTabs sessions={sessions} />
      </div>
    </section>
  )
}
