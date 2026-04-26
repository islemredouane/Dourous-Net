import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export const metadata = {
  title: 'Welcome to Dourous-Net — Set Up Your Profile',
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const defaultName =
    (user.user_metadata?.full_name as string | undefined) ?? ''

  return <OnboardingFlow userId={user.id} defaultName={defaultName} />
}
