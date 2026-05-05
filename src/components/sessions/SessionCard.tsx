import Link from 'next/link'
import { CATEGORY_COLORS } from '@/lib/constants'
import { Clock, User, BookOpen } from 'lucide-react'
import type { SessionWithTeacher } from '@/types'

interface SessionCardProps {
  readonly session: SessionWithTeacher
}

export function SessionCard({ session }: SessionCardProps) {
  const categoryColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS['General']

  return (
    <Link href={`/sessions/${session.id}`} className="block group h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f1629] transition-all duration-200 group-hover:border-indigo-500/40 group-hover:shadow-lg group-hover:shadow-indigo-500/10 group-hover:-translate-y-0.5">

        {/* Thumbnail */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-gradient-to-br from-indigo-900/50 to-slate-800/80">
          {session.thumbnail_url ? (
            <img
              src={session.thumbnail_url}
              alt={session.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-10 w-10 text-slate-600" />
            </div>
          )}

          {/* Free badge */}
          {session.is_free && (
            <span className="absolute top-2.5 right-2.5 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              Free
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Category */}
          <span className={`inline-flex w-fit rounded-md border px-2 py-0.5 text-[11px] font-medium ${categoryColor}`}>
            {session.category}
          </span>

          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-indigo-300 transition-colors" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {session.title}
          </h3>

          {/* Description */}
          {session.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
              {session.description}
            </p>
          )}

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-slate-500">
            {session.teacher && (
              <div className="flex items-center gap-1.5 min-w-0">
                <User className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                <span className="truncate max-w-[120px]">{session.teacher.full_name}</span>
              </div>
            )}
            {session.duration_hours > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <Clock className="h-3.5 w-3.5 text-slate-600" />
                <span>{session.duration_hours}h</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
