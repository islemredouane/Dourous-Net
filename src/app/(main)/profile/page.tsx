import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/profile/ProfileForm'
import type { Student } from '@/types'

export const metadata = { title: 'My Profile' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: profileRaw } = await supabase
    .from('students')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileRaw as Student | null
  if (!profile) redirect('/auth')

  return (
    <div className="min-h-screen bg-[#0B1120] pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-5 space-y-8">
        <div className="pb-6 border-b border-[#DDE3EC]/10">
          <p className="eyebrow text-[#7F97C7] mb-2">Account Dossier</p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            My Profile
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Manage your personal details, academic level, and public bio.
          </p>
        </div>

        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
