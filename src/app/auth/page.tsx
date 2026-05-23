import { AuthForm } from '@/components/auth/AuthForm'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HeroScene } from '@/components/3d/HeroScene'

export const metadata = {
  title: 'Sign In / Sign Up — Dourous-Net',
}

export default async function AuthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }
  
  return (
    <div className="relative min-h-screen flex w-full">
      {/* Left side: Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex flex-1 relative bg-black items-center justify-center overflow-hidden border-r border-white/10">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10" />
        
        <div className="relative z-20 max-w-xl px-12">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.5)] mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Elevate Your <span className="text-indigo-400">Learning</span> Experience.
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Join thousands of students and educators across Algeria on the most advanced digital learning platform. Seamless tracking, engaging courses, and AI-powered insights.
          </p>
          
          {/* Glowing user avatars */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-tr from-indigo-500 to-purple-500" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-tr from-emerald-500 to-teal-500" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-tr from-rose-500 to-pink-500" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-xl">+2k</div>
            </div>
            <p className="text-sm font-medium text-slate-400">Active learners this week</p>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-24 relative bg-[#090b14]">
        {/* Background glow for right side */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
