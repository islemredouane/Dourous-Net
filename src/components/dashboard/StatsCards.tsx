'use client'

import { Award, BookOpen, CheckCircle, TrendingUp } from 'lucide-react'
import type { Enrollment } from '@/types'

interface StatsCardsProps {
  readonly enrollments: Enrollment[]
  readonly quizCount?: number
  readonly avgQuizPct?: number | null
}

export function StatsCards({
  enrollments,
  quizCount = 0,
  avgQuizPct = null,
}: StatsCardsProps) {
  const total = enrollments.length
  const completed = enrollments.filter((e) => e.status === 'completed').length
  const inProgress = enrollments.filter((e) => e.status === 'in_progress').length
  const avgProgress =
    total === 0
      ? 0
      : Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / total)

  const cards = [
    {
      icon: BookOpen,
      label: 'Enrolled Courses',
      sublabel: `${inProgress} currently active`,
      value: String(total),
      accent: 'text-[#AEC6FF]',
      borderAccent: 'border-[#3B82F6]/30 bg-[#2563EB]/15',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      sublabel: total > 0 ? `${Math.round((completed / total) * 100)}% finish rate` : 'No completions yet',
      value: String(completed),
      accent: 'text-emerald-300',
      borderAccent: 'border-emerald-400/30 bg-emerald-500/15',
    },
    {
      icon: TrendingUp,
      label: 'Average Progress',
      sublabel: 'Across enrolled sessions',
      value: `${avgProgress}%`,
      accent: 'text-[#60A5FA]',
      borderAccent: 'border-sky-400/30 bg-sky-500/15',
    },
    {
      icon: Award,
      label: 'Quizzes Graded',
      sublabel: avgQuizPct !== null ? `${avgQuizPct}% avg score` : 'Take a quiz to track scores',
      value: String(quizCount),
      accent: 'text-amber-300',
      borderAccent: 'border-amber-400/30 bg-amber-500/15',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] p-5 hover:border-[#3B82F6]/35 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow text-[#8A94A8]">{card.label}</p>
                <p
                  className={`mt-2 text-3xl font-bold tabular-nums ${card.accent}`}
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {card.value}
                </p>
                <p className="mt-1.5 text-xs text-[#94A3B8]">{card.sublabel}</p>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${card.borderAccent}`}>
                <Icon className={`h-4.5 w-4.5 ${card.accent}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
