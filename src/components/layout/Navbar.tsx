'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { GradientText } from '@/components/shared/GradientText'
import { LogoIcon } from '@/components/shared/LogoIcon'
import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/lib/constants'
import { BookOpen, ChevronRight, LayoutDashboard, LogOut, Menu, User, X, GraduationCap, BookOpenCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { user, profile, loading } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const mobileLinks = [
    { label: 'Sessions', href: '/sessions', icon: BookOpen },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ...(profile?.role === 'teacher' ? [{ label: 'Teach', href: '/teacher', icon: GraduationCap }] : []),
    { label: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-strong border-b border-indigo-500/10 py-3'
            : 'bg-transparent py-5',
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <LogoIcon size={36} />
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              <GradientText>Dourous</GradientText>
              <span className="text-slate-100">-Net</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.filter(link => link.label !== 'Dashboard' || user).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            {loading ? null : user ? (
              <>
                {profile?.role === 'teacher' && (
                  <Link href="/teacher">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      Teach
                    </Button>
                  </Link>
                )}
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-300 hover:text-white">
                    <User className="h-4 w-4" />
                    {profile?.full_name?.split(' ')[0] ?? 'Profile'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-500 hover:text-red-400">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm transition-all hover:shadow-glow-md">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[60] md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide-in panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-[70] h-full w-[82vw] max-w-xs md:hidden',
          'bg-[#070d1a] border-l border-white/[0.07]',
          'flex flex-col transition-transform duration-300 ease-out',
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              <GradientText>Dourous</GradientText>
              <span className="text-slate-100">-Net</span>
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          <Link
            href="/sessions"
            onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen(false)}
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
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-slate-300 hover:text-white border border-white/[0.08]">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth" onClick={() => setMenuOpen(false)}>
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
