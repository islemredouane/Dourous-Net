'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { BookOpen, GraduationCap, LayoutDashboard, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const { user, profile, loading } = useUser()
  const pathname = usePathname()

  // Only show for signed-in users
  if (loading || !user) return null

  const items = [
    { label: 'Sessions', href: '/sessions', icon: BookOpen },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ...(profile?.role === 'teacher'
      ? [{ label: 'Teach', href: '/teacher', icon: GraduationCap }]
      : []
    ),
    { label: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glass bar */}
      <div className="mx-3 mb-3 rounded-2xl border border-white/[0.08] bg-[#070d1a]/90 backdrop-blur-xl px-2 py-2">
        <div className="flex items-center justify-around">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors min-w-0',
                  active
                    ? 'text-indigo-400'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center h-8 w-8 rounded-xl transition-colors',
                  active && 'bg-indigo-500/15'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
