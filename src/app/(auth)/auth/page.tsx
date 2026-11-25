import { AuthForm } from '@/components/auth/AuthForm'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { HeroScene } from '@/components/3d/HeroScene'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Sign In / Sign Up',
}

export default async function AuthPage() {
  const cookieStore = await cookies()
  const hasAuthCookie = cookieStore.getAll().some((c) => c.name.startsWith('sb-'))

  if (hasAuthCookie) {
    try {
      const supabase = await createClient()
      const authResult = await Promise.race([
        supabase.auth.getUser(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
      ])
      if (authResult?.data?.user) {
        redirect('/dashboard')
      }
    } catch {
      // Allow rendering auth form if Supabase is unreachable
    }
  }

  return (
    <div className="relative min-h-[100svh] lg:h-[100svh] lg:overflow-hidden grid lg:grid-cols-2 w-full bg-[#0B1120]">
      {/* Left Visual Column — houses Brand & Back to Dourous-Net away from the form */}
      <aside className="hidden lg:block p-3 h-full">
        <div className="relative h-full overflow-hidden rounded-[28px] border border-[#DDE3EC]/12 bg-[#080E1D] flex flex-col justify-between p-8 xl:p-10">
          <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
          <div className="absolute inset-0 z-0 opacity-75 pointer-events-none">
            <HeroScene />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#080E1D]/75 via-[#080E1D]/55 to-[#0B1120]/90 z-10 pointer-events-none" />

          {/* Top Bar on Visual Side: Back to Dourous-Net */}
          <div className="relative z-20 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#DDE3EC]/18 bg-[#0B1120]/75 px-4 font-mono text-xs uppercase tracking-wider text-[#DDE3EC] backdrop-blur-md hover:border-[#3B82F6]/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dourous-Net</span>
            </Link>

            <span className="rounded-full border border-[#3B82F6]/30 bg-[#2563EB]/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#AEC6FF] backdrop-blur-md">
              DZ Learning Hub
            </span>
          </div>

          {/* Bottom Anchor: Value Prop & Bento Metrics (Medlink aside architecture) */}
          <div className="relative z-20 max-w-lg space-y-6">
            <BrandLogo size={34} />

            <h2
              className="text-3xl xl:text-[2.65rem] font-bold text-white leading-[1.08] tracking-tight"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Structured learning. Algerian educators.
            </h2>

            <p
              className="border-l-2 border-[#2563EB] pl-4 text-base xl:text-lg italic text-[#DDE3EC]/80 leading-relaxed"
              style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
            >
              &ldquo;Access video curricula, instant-graded quizzes, and AI tutoring across six core disciplines.&rdquo;
            </p>

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#DDE3EC]/15 bg-[#DDE3EC]/12 backdrop-blur-md">
              <div className="bg-[#0B1120]/80 px-4 py-3.5">
                <p
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  6 Tracks
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A94A8]">
                  Disciplines
                </p>
              </div>
              <div className="bg-[#0B1120]/80 px-4 py-3.5">
                <p
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  0 DA
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A94A8]">
                  Open Access
                </p>
              </div>
              <div className="bg-[#0B1120]/80 px-4 py-3.5">
                <p
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  100%
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A94A8]">
                  RLS Secured
                </p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[#94A3B8]">
              {[
                'Instant demo access for both Student & Teacher portals',
                'YouTube, Google Drive & Vimeo structured lesson streaming',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Right Auth Form Column — compact zero-scroll layout on lg+ */}
      <div className="flex min-h-[100svh] lg:min-h-0 lg:h-full flex-col justify-between px-5 py-4 sm:px-10 bg-[#0B1120]">
        {/* Mobile-only top strip (Visual side has the Back button on lg+) */}
        <div className="flex items-center justify-between pt-1 pb-2 lg:hidden">
          <BrandLogo size={28} />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E] px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider text-[#DDE3EC]"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Home</span>
          </Link>
        </div>

        <div className="my-auto w-full py-2">
          <AuthForm />
        </div>

        <p className="pb-1 text-center font-mono text-[10.5px] text-[#8A94A8]">
          Protected by Supabase Auth &amp; Row-Level Security
        </p>
      </div>
    </div>
  )
}
