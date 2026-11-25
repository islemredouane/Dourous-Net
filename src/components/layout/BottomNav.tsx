'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { useUser } from '@/hooks/useUser'
import {
  BookOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogIn,
  Plus,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavItem {
  label: string
  href: string
  icon: LucideIcon
  highlightCta?: boolean
}

const GUEST_ITEMS: BottomNavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Sessions', href: '/sessions', icon: BookOpen },
  { label: 'Teachers', href: '/teachers', icon: Users },
  { label: 'Sign in', href: '/auth', icon: LogIn },
]

const STUDENT_ITEMS: BottomNavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Sessions', href: '/sessions', icon: BookOpen },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/profile', icon: User },
]

const TEACHER_ITEMS: BottomNavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Sessions', href: '/sessions', icon: BookOpen },
  { label: 'Create', href: '/teacher/new', icon: Plus, highlightCta: true },
  { label: 'Studio', href: '/teacher', icon: GraduationCap },
  { label: 'Profile', href: '/profile', icon: User },
]

function getActiveHref(pathname: string | null, items: BottomNavItem[]): string | null {
  if (!pathname) return null
  // Longest matching route prefix prevents /teacher and /teacher/new both lighting up
  let matchedHref: string | null = null
  for (const item of items) {
    const isExact = pathname === item.href
    const isNested = item.href !== '/' && pathname.startsWith(`${item.href}/`)
    if ((isExact || isNested) && (!matchedHref || item.href.length > matchedHref.length)) {
      matchedHref = item.href
    }
  }
  return matchedHref
}

export function BottomNav() {
  const { user, profile, loading } = useUser()
  const pathname = usePathname()
  const prefersReduced = useReducedMotion()

  const items: BottomNavItem[] =
    loading || !user
      ? GUEST_ITEMS
      : profile?.role === 'teacher'
      ? TEACHER_ITEMS
      : STUDENT_ITEMS

  const activeHref = getActiveHref(pathname, items)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(14px,env(safe-area-inset-bottom))] z-40 px-3 md:hidden">
      <nav
        aria-label="Mobile quick navigation"
        className="pointer-events-auto relative mx-auto w-full max-w-[410px] rounded-full border border-[#DDE3EC]/14 bg-[#0B1120]/90 px-2 py-1.5 backdrop-blur-2xl shadow-[0_18px_44px_-10px_rgba(0,0,0,0.8)]"
      >
        <div
          className={cn(
            'grid items-center gap-0.5',
            items.length === 5 ? 'grid-cols-5' : 'grid-cols-4',
          )}
        >
          {items.map((item) => {
            const Icon = item.icon
            const active = activeHref === item.href

            if (item.highlightCta) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="group relative flex flex-col items-center justify-center gap-0.5 py-0.5 min-w-0"
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white transition-colors duration-200 group-hover:bg-[#1D4ED8] group-active:scale-95',
                      active && 'bg-[#1D4ED8]',
                    )}
                  >
                    <Icon className="h-[17px] w-[17px]" strokeWidth={2.4} />
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-semibold tracking-tight truncate max-w-full',
                      active ? 'text-white' : 'text-[#DDE3EC]/85',
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-full py-2 px-1 transition-colors',
                  active
                    ? 'text-white'
                    : 'text-[#8A94A8] hover:text-[#DDE3EC]',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-pill"
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 440, damping: 34 }
                    }
                    className="absolute inset-0 z-0 rounded-full bg-[#2563EB]"
                  />
                )}
                <Icon
                  className={cn(
                    'relative z-10 h-[18px] w-[18px] transition-colors',
                    active && 'text-white',
                  )}
                  strokeWidth={active ? 2.2 : 1.85}
                />
                <span className="relative z-10 max-w-full truncate text-[10px] font-medium tracking-tight">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
