import Link from 'next/link'
import {
  CATEGORY_COLORS,
  CATEGORY_COLORS_LIGHT,
  CATEGORY_GRADIENTS,
} from '@/lib/constants'
import { SpotlightCard } from '@/components/shared/SpotlightCard'
import { ArrowUpRight, BookOpen, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionWithTeacher } from '@/types'

interface SessionCardProps {
  readonly session: SessionWithTeacher
  readonly tone?: 'dark' | 'light'
}

export function SessionCard({ session, tone = 'dark' }: SessionCardProps) {
  const isLight = tone === 'light'
  const categoryBadge = isLight
    ? (CATEGORY_COLORS_LIGHT[session.category] ?? CATEGORY_COLORS_LIGHT.General)
    : (CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS.General)
  const fallbackGradient =
    CATEGORY_GRADIENTS[session.category] ?? CATEGORY_GRADIENTS.General

  return (
    <Link href={`/sessions/${session.id}`} className="block group h-full">
      <SpotlightCard tone={tone} className="h-full flex flex-col">
        {/* 16:10 Media Header */}
        <div
          className={cn(
            'relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b',
            isLight ? 'border-[#1B2A55]/10' : 'border-[#DDE3EC]/10',
            fallbackGradient,
          )}
        >
          {session.thumbnail_url ? (
            <img
              src={session.thumbnail_url}
              alt={session.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-dots">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#DDE3EC]/15 bg-[#0B1120]/70">
                <BookOpen className="h-5 w-5 text-[#AEC6FF]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A94A8]">
                {session.category}
              </span>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-mono font-semibold uppercase tracking-wider border',
                session.is_free
                  ? 'bg-[#0B1120]/85 text-emerald-300 border-emerald-400/35'
                  : 'bg-[#0B1120]/85 text-amber-300 border-amber-400/35',
              )}
            >
              {session.is_free ? 'Free' : 'Premium'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={cn(
                'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wider',
                categoryBadge,
              )}
            >
              {session.category}
            </span>
            {session.duration_hours > 0 && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-mono text-[11px]',
                  isLight ? 'text-slate-500' : 'text-[#8A94A8]',
                )}
              >
                <Clock className="h-3 w-3" />
                {session.duration_hours}h
              </span>
            )}
          </div>

          <h3
            className={cn(
              'line-clamp-2 text-[17px] font-bold leading-snug tracking-tight transition-colors',
              isLight
                ? 'text-[#0B1120] group-hover:text-[#2563EB]'
                : 'text-white group-hover:text-[#AEC6FF]',
            )}
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {session.title}
          </h3>

          {session.description && (
            <p
              className={cn(
                'mt-2 line-clamp-2 text-[13.5px] leading-relaxed',
                isLight ? 'text-[#3A4458]' : 'text-[#94A3B8]',
              )}
            >
              {session.description}
            </p>
          )}

          {/* Footer row */}
          <div
            className={cn(
              'mt-auto pt-4 mt-5 flex items-center justify-between border-t text-xs',
              isLight
                ? 'border-[#1B2A55]/10 text-slate-600'
                : 'border-[#DDE3EC]/10 text-[#8A94A8]',
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                  isLight
                    ? 'bg-[#1B2A55] text-white'
                    : 'bg-[#1B2A55] text-[#AEC6FF]',
                )}
              >
                {session.teacher?.full_name ? (
                  session.teacher.full_name.charAt(0).toUpperCase()
                ) : (
                  <User className="h-3 w-3" />
                )}
              </span>
              <span className="truncate font-medium">
                {session.teacher?.full_name ?? 'Dourous Instructor'}
              </span>
            </div>

            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium shrink-0 transition-transform group-hover:translate-x-0.5',
                isLight ? 'text-[#2563EB]' : 'text-[#AEC6FF]',
              )}
            >
              <span>View</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  )
}
