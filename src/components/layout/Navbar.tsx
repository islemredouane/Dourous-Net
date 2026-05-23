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
import { LogOut, Menu, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MobileMenu } from './MobileMenu'

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
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-400 hover:text-red-400">
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
      <MobileMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        user={user} 
        profile={profile} 
        loading={loading} 
        onSignOut={handleSignOut} 
      />
    </>
  )
}
