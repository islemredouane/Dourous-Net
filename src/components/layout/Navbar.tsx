'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { GradientText } from '@/components/shared/GradientText'
import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/lib/constants'
import { BookOpen, LogOut, Menu, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { user, profile, loading } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-glow-sm transition-transform duration-300 group-hover:scale-110">
            <BookOpen className="h-4 w-4 text-white" />
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

        {/* CTA */}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-slate-500 hover:text-red-400"
              >
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
                <Button
                  size="sm"
                  className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm transition-all hover:shadow-glow-md"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="glass-strong border-t border-indigo-500/10 md:hidden">
          <div className="flex flex-col gap-2 p-4">
            {NAV_LINKS.filter(link => link.label !== 'Dashboard' || user).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!loading && user && (
              <>
                {profile?.role === 'teacher' && (
                  <Link href="/teacher" className="rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-white" onClick={() => setMenuOpen(false)}>
                    Teach
                  </Link>
                )}
                <Link href="/profile" className="rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-white" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="rounded-lg px-4 py-2 text-left text-slate-400 hover:bg-white/5 hover:text-red-400">
                  Sign Out
                </button>
              </>
            )}
            {!loading && !user && (
              <Link href="/auth" onClick={() => setMenuOpen(false)}>
                <Button className="w-full mt-2 bg-indigo-500 text-white hover:bg-indigo-600">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
