'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DISCIPLINES, SITE_CONFIG } from '@/lib/constants'
import { useCommandPalette } from './CommandPalette'
import { GitHubStarButton } from '@/components/shared/GitHubStarButton'
import { InstallAppButton } from '@/components/pwa/InstallAppButton'
import { ArrowRight, LogOut, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Student } from '@/types'
import type { User } from '@supabase/supabase-js'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  profile: Student | null
  loading: boolean
  onSignOut: () => void
}

export function MobileMenu({
  isOpen,
  onClose,
  user,
  profile,
  loading,
  onSignOut,
}: MobileMenuProps) {
  const pathname = usePathname()
  const { setOpen: setSearchOpen } = useCommandPalette()

  const mainLinks = [
    { label: 'Sessions', href: '/sessions' },
    { label: 'Teachers', href: '/teachers' },
    { label: 'About', href: '/about' },
    ...(user ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
    ...(user && profile?.role === 'teacher'
      ? [{ label: 'Teacher Studio', href: '/teacher' }]
      : []),
    ...(user ? [{ label: 'Profile', href: '/profile' }] : []),
  ]

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 lg:hidden bg-[#0B1120]/98 transition-all duration-300 pt-[calc(68px+var(--pwa-safe-top))]',
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none',
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

      <div className="relative h-full overflow-y-auto px-5 py-6 flex flex-col max-w-2xl mx-auto">
        {/* Quick Search bar (single-row fixed height) */}
        <button
          type="button"
          onClick={() => {
            onClose()
            setSearchOpen(true)
          }}
          className="mb-6 flex h-11 w-full shrink-0 items-center justify-between gap-3 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E]/95 px-4 text-left text-[13.5px] text-[#8A94A8] hover:border-[#3B82F6]/45 hover:text-white transition-colors"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            <Search className="h-4 w-4 shrink-0 text-[#7F97C7]" />
            <span className="truncate whitespace-nowrap">
              Search courses, disciplines, teachers...
            </span>
          </span>
          <span className="shrink-0 rounded-full border border-[#DDE3EC]/12 bg-[#162038] px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-[#7F97C7]">
            SEARCH
          </span>
        </button>

        {/* Numbered Main Links (INSIGHT mobile menu pattern) */}
        <p className="eyebrow text-[#7F97C7] mb-3">Navigation</p>
        <nav aria-label="Mobile primary" className="border-t border-[#DDE3EC]/10">
          {mainLinks.map((item, idx) => {
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 py-3.5 border-b border-[#DDE3EC]/10 group transition-colors',
                  active ? 'text-[#AEC6FF]' : 'text-white hover:text-[#AEC6FF]',
                )}
              >
                <span className="font-mono text-xs font-semibold text-[#7F97C7] w-6">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {item.label}
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-[#7F97C7] group-hover:translate-x-1 transition-transform" />
              </Link>
            )
          })}
        </nav>

        {/* Discipline Chips */}
        <div className="mt-6 mb-6">
          <p className="eyebrow text-[#8A94A8] mb-3">Explore Disciplines</p>
          <div className="grid grid-cols-2 gap-2.5">
            {DISCIPLINES.map((d) => (
              <Link
                key={d.value}
                href={`/sessions?category=${encodeURIComponent(d.value)}`}
                onClick={onClose}
                className="flex min-h-[44px] items-center gap-2.5 rounded-full border border-[#DDE3EC]/12 bg-[#121A2E] px-4 py-2.5 text-[13px] font-medium text-[#DDE3EC] hover:border-[#3B82F6]/45 hover:text-white transition-colors"
              >
                <span className="font-mono text-[11px] text-[#7F97C7] shrink-0">{d.code}</span>
                <span className="truncate">{d.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Footer */}
        <div className="mt-auto pt-8 pb-20 border-t border-[#DDE3EC]/10 space-y-3">
          {!loading && user ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {profile?.full_name ?? 'Learner'}
                  </p>
                  <p className="text-xs font-mono text-[#8A94A8] uppercase">
                    {profile?.role === 'teacher' ? 'Teacher Account' : 'Student Account'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4.5 text-[13px] font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/auth"
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-full border border-[#DDE3EC]/20 text-sm font-medium text-[#DDE3EC] hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/auth"
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white hover:bg-[#1D4ED8]"
              >
                Get Started
              </Link>
            </div>
          )}
          <div className="pt-2 flex flex-col gap-3">
            <InstallAppButton className="w-full h-11" />
            <GitHubStarButton
              label="Star on GitHub"
              className="w-full h-11 justify-center"
            />
            <p className="text-[11px] font-mono text-[#8A94A8]">
              <span className="whitespace-nowrap">{SITE_CONFIG.email}</span> · {SITE_CONFIG.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
