'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { GitHubStarButton } from '@/components/shared/GitHubStarButton'
import { useCommandPalette } from '@/components/layout/CommandPalette'
import { NAV_LINKS } from '@/lib/constants'
import {
  ArrowRight,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExploreMegaMenu } from './ExploreMegaMenu'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const { user, profile, loading } = useUser()
  const { setOpen: setSearchOpen } = useCommandPalette()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const exploreRef = useRef<HTMLDivElement>(null)
  const exploreDrawerRef = useRef<HTMLDivElement>(null)
  const exploreCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exploreHoverAtRef = useRef(0)
  const profileRef = useRef<HTMLDivElement>(null)

  const activeCategory = searchParams?.get('category') ?? ''
  const routeKey = `${pathname ?? ''}::${activeCategory}`

  const [scrolled, setScrolled] = useState(false)
  const [menuState, setMenuState] = useState({ open: false, routeKey })
  const [exploreState, setExploreState] = useState({ open: false, routeKey })
  const [profileState, setProfileState] = useState({ open: false, routeKey })

  const menuOpen = menuState.open && menuState.routeKey === routeKey
  const exploreOpen = exploreState.open && exploreState.routeKey === routeKey
  const profileOpen = profileState.open && profileState.routeKey === routeKey

  const setMenuOpen = (next: boolean | ((prev: boolean) => boolean)) =>
    setMenuState((s) => ({
      open: typeof next === 'function' ? next(s.open && s.routeKey === routeKey) : next,
      routeKey,
    }))

  const setExploreOpen = (next: boolean | ((prev: boolean) => boolean)) =>
    setExploreState((s) => ({
      open: typeof next === 'function' ? next(s.open && s.routeKey === routeKey) : next,
      routeKey,
    }))

  const setProfileOpen = (next: boolean | ((prev: boolean) => boolean)) =>
    setProfileState((s) => ({
      open: typeof next === 'function' ? next(s.open && s.routeKey === routeKey) : next,
      routeKey,
    }))

  // Scroll tracking for translucent header depth
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20 || menuOpen)
    }
    const raf = requestAnimationFrame(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [menuOpen])

  // Click outside for dropdowns
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      const insideExploreTrigger = exploreRef.current?.contains(target)
      const insideExploreDrawer = exploreDrawerRef.current?.contains(target)
      if (!insideExploreTrigger && !insideExploreDrawer) {
        setExploreState((s) => (s.open ? { ...s, open: false } : s))
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileState((s) => (s.open ? { ...s, open: false } : s))
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (exploreCloseTimerRef.current) {
        clearTimeout(exploreCloseTimerRef.current)
      }
    }
  }, [])

  const clearExploreCloseTimer = () => {
    if (exploreCloseTimerRef.current) {
      clearTimeout(exploreCloseTimerRef.current)
      exploreCloseTimerRef.current = null
    }
  }

  const handleExploreMouseEnter = () => {
    clearExploreCloseTimer()
    setProfileOpen(false)
    if (!exploreOpen) {
      exploreHoverAtRef.current = Date.now()
    }
    setExploreOpen(true)
  }

  const handleExploreMouseLeave = () => {
    clearExploreCloseTimer()
    exploreCloseTimerRef.current = setTimeout(() => {
      setExploreOpen(false)
    }, 150)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMenuOpen(false)
    setProfileOpen(false)
    router.push('/')
    router.refresh()
  }

  const isRouteActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  const visibleLinks = NAV_LINKS.filter((l) => !('authOnly' in l && l.authOnly) || user)

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-colors duration-300 border-b',
          scrolled
            ? 'bg-[#0B1120]/92 backdrop-blur-md border-[#DDE3EC]/10'
            : 'bg-[#0B1120]/60 backdrop-blur-sm border-transparent',
        )}
      >
        {/* Row 1: Primary Bar */}
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-4 px-5 md:px-10">
          <BrandLogo size={32} onClick={() => setMenuOpen(false)} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 h-full" aria-label="Main">
            {/* Explore Subjects Trigger (drawer rendered beside <header> to avoid backdrop-filter fixed containment) */}
            <div
              ref={exploreRef}
              onMouseEnter={handleExploreMouseEnter}
              onMouseLeave={handleExploreMouseLeave}
              className="relative flex items-center h-full"
            >
              <button
                type="button"
                onClick={() => {
                  clearExploreCloseTimer()
                  setProfileOpen(false)
                  if (exploreOpen && Date.now() - exploreHoverAtRef.current < 500) {
                    return
                  }
                  setExploreOpen((v) => !v)
                }}
                aria-expanded={exploreOpen}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-medium transition-colors',
                  exploreOpen
                    ? 'bg-[#121A2E] text-white'
                    : 'text-[#DDE3EC]/80 hover:text-white hover:bg-[#121A2E]/60',
                )}
              >
                <span>Explore</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 text-[#7F97C7] transition-transform duration-200',
                    exploreOpen && 'rotate-180 text-[#AEC6FF]',
                  )}
                />
              </button>
            </div>

            {visibleLinks.map((link) => {
              const active = isRouteActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center h-full text-[14.5px] font-medium transition-colors',
                    active ? 'text-white' : 'text-[#DDE3EC]/75 hover:text-white',
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-px h-[2px] bg-[#2563EB] transition-transform duration-200 origin-left',
                      active ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Command Search trigger (Desktop + Tablet) */}
            <button
              type="button"
              onClick={() => {
                setExploreOpen(false)
                setProfileOpen(false)
                setSearchOpen(true)
              }}
              aria-label="Search courses and teachers"
              className="hidden sm:inline-flex items-center gap-2.5 h-10 px-3.5 xl:px-4 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E]/90 text-[13px] text-[#8A94A8] hover:border-[#DDE3EC]/35 hover:text-white transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-[#7F97C7]" />
              <span className="hidden xl:inline">Search...</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full font-mono text-[10px] border border-[#DDE3EC]/15 text-[#7F97C7]">
                ⌘K
              </kbd>
            </button>

            <GitHubStarButton className="hidden lg:inline-flex px-3.5" />

            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                setSearchOpen(true)
              }}
              aria-label="Open search"
              className="flex sm:hidden h-10 w-10 items-center justify-center rounded-full border border-[#DDE3EC]/15 text-[#DDE3EC] hover:border-[#DDE3EC]/40"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Desktop Auth / Profile */}
            <div className="hidden lg:flex items-center gap-2.5">
              {loading ? (
                <div className="h-10 w-28 rounded-full bg-[#121A2E] animate-pulse border border-[#DDE3EC]/10" />
              ) : user ? (
                <>
                  {profile?.role === 'teacher' && (
                    <Link
                      href="/teacher"
                      className={cn(
                        'inline-flex items-center gap-1.5 h-10 px-4.5 rounded-full border text-[13px] font-medium transition-colors',
                        pathname?.startsWith('/teacher')
                          ? 'border-[#3B82F6] bg-[#2563EB]/15 text-[#AEC6FF]'
                          : 'border-[#DDE3EC]/18 text-[#DDE3EC] hover:border-[#3B82F6]/60 hover:text-white',
                      )}
                    >
                      <GraduationCap className="h-4 w-4 text-[#60A5FA]" />
                      <span>Teacher Studio</span>
                    </Link>
                  )}

                  {/* User Dropdown */}
                  <div ref={profileRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setExploreOpen(false)
                        setProfileOpen((v) => !v)
                      }}
                      aria-expanded={profileOpen}
                      className="inline-flex items-center gap-2 h-10 pl-2 pr-4 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E] text-[13px] font-medium text-white hover:border-[#DDE3EC]/35 transition-colors"
                    >
                      <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-[#2563EB] text-[11px] font-bold text-white overflow-hidden">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </span>
                      <span className="max-w-[96px] truncate">
                        {profile?.full_name?.split(' ')[0] ?? 'Account'}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 text-[#8A94A8] transition-transform',
                          profileOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#DDE3EC]/12 bg-[#0B1120]/96 backdrop-blur-2xl p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.65)]">
                        <div className="px-3 py-2 border-b border-[#DDE3EC]/10 mb-1">
                          <p className="text-xs font-semibold text-white truncate">
                            {profile?.full_name || 'Learner'}
                          </p>
                          <p className="text-[11px] text-[#8A94A8] truncate">
                            {profile?.email ?? user.email}
                          </p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-[#DDE3EC] hover:bg-[#162038] hover:text-white transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#60A5FA]" />
                          Dashboard
                        </Link>
                        {profile?.role === 'teacher' && (
                          <Link
                            href="/teacher"
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-[#DDE3EC] hover:bg-[#162038] hover:text-white transition-colors"
                          >
                            <GraduationCap className="h-4 w-4 text-[#60A5FA]" />
                            Teacher Portal
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-[#DDE3EC] hover:bg-[#162038] hover:text-white transition-colors"
                        >
                          <User className="h-4 w-4 text-[#60A5FA]" />
                          My Profile
                        </Link>
                        <div className="my-1 border-t border-[#DDE3EC]/10" />
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-[13px] font-semibold text-white transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {/* Mobile Hamburger (INSIGHT 2-line morph button) */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="relative flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-[#DDE3EC]/18 text-[#DDE3EC] hover:border-[#DDE3EC]/45 transition-colors"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute h-[1.5px] w-4 bg-current transition-transform duration-300',
                  menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1',
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'absolute h-[1.5px] w-4 bg-current transition-transform duration-300',
                  menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <ExploreMegaMenu
        ref={exploreDrawerRef}
        open={exploreOpen}
        activeCategory={activeCategory}
        onClose={() => {
          clearExploreCloseTimer()
          setExploreOpen(false)
        }}
        onOpenSearch={() => setSearchOpen(true)}
        onMouseEnter={handleExploreMouseEnter}
        onMouseLeave={handleExploreMouseLeave}
      />

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
