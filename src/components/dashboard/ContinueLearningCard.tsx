'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, TrendingUp } from 'lucide-react'
import { CATEGORY_COLORS } from '@/lib/constants'
import type { EnrollmentWithSession } from '@/types'

interface ContinueLearningCardProps {
  readonly enrollment: EnrollmentWithSession | null
}

export function ContinueLearningCard({ enrollment }: ContinueLearningCardProps) {
  if (!enrollment || enrollment.status === 'completed' || !enrollment.session) return null

  const session = enrollment.session
  const categoryColor = CATEGORY_COLORS[session.category] ?? CATEGORY_COLORS['General']

  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0f172a] to-indigo-950/20 relative shadow-glow-sm">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      
      <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Up Next
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${categoryColor}`}>
              {session.category}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 truncate" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {session.title}
          </h3>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span className="font-semibold text-indigo-300">{enrollment.progress}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <Link href={`/sessions/${session.id}/learn`}>
            <Button size="lg" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-glow-sm hover:shadow-glow-md transition-all px-8 py-6 rounded-2xl group">
              <Play className="mr-2 h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
              Continue Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
