import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { GradientText } from '@/components/shared/GradientText'
import type { Student } from '@/types'

export const metadata = { title: 'My Profile — Dourous-Net' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profileRaw } = await supabase
    .from('students')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileRaw as Student | null
  if (!profile) redirect('/auth')

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16">
      <div className="mx-auto max-w-4xl px-4 space-y-8">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Account
          </p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            My <GradientText>Profile</GradientText>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and preferences.
          </p>
        </div>

        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
