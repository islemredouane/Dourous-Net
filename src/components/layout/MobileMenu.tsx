'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GradientText } from '@/components/shared/GradientText'
import { LogoIcon } from '@/components/shared/LogoIcon'
import { Button } from '@/components/ui/button'
import { BookOpen, ChevronRight, LayoutDashboard, LogOut, X, GraduationCap, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  user: any
  profile: any
  loading: boolean
  onSignOut: () => void
}

export function MobileMenu({ isOpen, onClose, user, profile, loading, onSignOut }: MobileMenuProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[60] md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-[70] h-full w-[82vw] max-w-xs md:hidden',
          'bg-[#070d1a] border-l border-white/[0.07]',
          'flex flex-col transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              <GradientText>Dourous</GradientText>
              <span className="text-slate-100">-Net</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          <Link
            href="/sessions"
            onClick={onClose}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
              pathname === '/sessions'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
            )}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4" />
              Sessions
            </div>
            <ChevronRight className="h-4 w-4 opacity-40" />
          </Link>

          {user && (
            <Link
              href="/dashboard"
              onClick={onClose}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                pathname === '/dashboard'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </Link>
          )}

          {user && profile?.role === 'teacher' && (
            <Link
              href="/teacher"
              onClick={onClose}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                pathname?.startsWith('/teacher')
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4" />
                Teach
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </Link>
          )}

          {user && (
            <Link
              href="/profile"
              onClick={onClose}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                pathname === '/profile'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <User className="h-4 w-4" />
                Profile
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </Link>
          )}
        </nav>

        {/* Auth section */}
        <div className="px-4 pb-8 pt-4 border-t border-white/[0.06] space-y-3">
          {!loading && user ? (
            <>
              <div className="flex items-center gap-3 px-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{profile?.full_name ?? 'User'}</p>
                  <p className="text-xs text-slate-500">{profile?.role === 'teacher' ? 'Teacher' : 'Student'}</p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" onClick={onClose}>
                <Button variant="ghost" className="w-full text-slate-300 hover:text-white border border-white/[0.08]">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth" onClick={onClose}>
                <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
