import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreateSessionForm } from '@/components/teacher/CreateSessionForm'
import { GradientText } from '@/components/shared/GradientText'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'New Session — Dourous-Net' }

export default async function NewSessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 space-y-8">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teacher Portal
        </Link>

        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Create Content
          </p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            New <GradientText>Session</GradientText>
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            Share your knowledge with learners across Algeria.
          </p>
        </div>

        <CreateSessionForm teacherId={user.id} />
      </div>
    </div>
  )
}
