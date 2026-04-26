import Link from 'next/link'
import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from '@/lib/constants'
import { Clock, User, BookOpen } from 'lucide-react'
import type { SessionWithTeacher } from '@/types'

interface SessionCardProps {
  readonly session: SessionWithTeacher
}

export function SessionCard({ session }: SessionCardProps) {
  const categoryColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS['General']
  const categoryGradient = CATEGORY_GRADIENTS[session.category] ?? CATEGORY_GRADIENTS['General']

  return (
    <Link href={`/sessions/${session.id}`} className="block group">
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f172a] transition-all duration-300 group-hover:border-indigo-500/30 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] group-hover:-translate-y-1">
        {/* Thumbnail / gradient header */}
        <div className={`relative h-44 w-full overflow-hidden ${categoryGradient}`}>
          {session.thumbnail_url ? (
            <img
              src={session.thumbnail_url}
              alt={session.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
            />
          ) : (
            <>
              {/* Animated mesh orbs */}
              <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 -left-4 h-24 w-24 rounded-full bg-white/5 blur-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <BookOpen className="h-7 w-7 text-white/80" />
                </div>
              </div>
            </>
          )}

          {/* Gradient fade to card bg */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0f172a] to-transparent" />

          {/* Category badge */}
          <span className={`absolute top-3 left-3 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${categoryColor}`}>
            {session.category}
          </span>

          {/* Free badge */}
          {session.is_free && (
            <span className="absolute top-3 right-3 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
              Free
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col p-5 pt-4">
          <h3
            className="mb-2 line-clamp-2 text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-indigo-300"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            {session.title}
          </h3>

          {session.description && (
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
              {session.description}
            </p>
          )}

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.05]">
            {session.teacher && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/20">
                  <User className="h-3 w-3 text-indigo-400" />
                </div>
                <span className="truncate text-xs text-slate-500 max-w-[110px]">
                  {session.teacher.full_name}
                </span>
              </div>
            )}

            {session.duration_hours > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Clock className="h-3 w-3" />
                <span>{session.duration_hours}h</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom glow line on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  )
}
