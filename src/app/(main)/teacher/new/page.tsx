import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreateSessionForm } from '@/components/teacher/CreateSessionForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'New Session — Teacher Studio' }

export default async function NewSessionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  return (
    <div className="min-h-screen bg-[#0B1120] pt-32 pb-24">
      <div className="mx-auto max-w-2xl px-5 space-y-8">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A94A8] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Teacher Studio
        </Link>

        <div className="pb-5 border-b border-[#DDE3EC]/10">
          <p className="eyebrow text-[#7F97C7] mb-2">Course Authoring</p>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Create New Session
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Publish a course to the catalog, then add video lessons and quizzes.
          </p>
        </div>

        <CreateSessionForm teacherId={user.id} />
      </div>
    </div>
  )
}
