'use client'

import { BookOpen, CheckCircle, TrendingUp } from 'lucide-react'
import type { Enrollment } from '@/types'

interface CircleProgressProps {
  value: number
  max: number
  color: string
  trackColor: string
  size?: number
  stroke?: number
}

function CircleProgress({ value, max, color, trackColor, size = 64, stroke = 5 }: CircleProgressProps) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = max === 0 ? 0 : Math.min(value / max, 1)
  const dash = circ * pct

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  )
}

interface StatsCardsProps {
  readonly enrollments: Enrollment[]
}

export function StatsCards({ enrollments }: StatsCardsProps) {
  const total = enrollments.length
  const completed = enrollments.filter((e) => e.status === 'completed').length
  const inProgress = enrollments.filter((e) => e.status === 'in_progress').length
  const avgProgress =
    total === 0
      ? 0
      : Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / total)

  const stats = [
    {
      icon: BookOpen,
      label: 'Enrolled',
      sublabel: 'Total courses',
      value: total,
      suffix: '',
      circleValue: total,
      circleMax: Math.max(total, 1),
      color: '#6366f1',
      track: 'rgba(99,102,241,0.15)',
      iconBg: 'from-indigo-500/20 to-indigo-600/10',
      iconColor: 'text-indigo-400',
      gradient: 'from-indigo-500/10',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      sublabel: `${inProgress} in progress`,
      value: completed,
      suffix: '',
      circleValue: completed,
      circleMax: Math.max(total, 1),
      color: '#22c55e',
      track: 'rgba(34,197,94,0.15)',
      iconBg: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
      gradient: 'from-green-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Avg. Progress',
      sublabel: 'Across all courses',
      value: avgProgress,
      suffix: '%',
      circleValue: avgProgress,
      circleMax: 100,
      color: '#a855f7',
      track: 'rgba(168,85,247,0.15)',
      iconBg: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
      gradient: 'from-purple-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f172a] p-5 transition-all duration-300 hover:border-white/[0.12]"
          >
            {/* Subtle corner gradient */}
            <div className={`absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-bl ${stat.gradient} to-transparent blur-2xl opacity-60`} />

            <div className="relative flex items-center gap-4">
              {/* Circular progress with icon centered */}
              <div className="relative shrink-0">
                <CircleProgress
                  value={stat.circleValue}
                  max={stat.circleMax}
                  color={stat.color}
                  trackColor={stat.track}
                  size={64}
                  stroke={5}
                />
                <div className={`absolute inset-0 flex items-center justify-center`}>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${stat.iconBg}`}>
                    <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-500 mb-0.5">{stat.sublabel}</p>
                <p
                  className="text-3xl font-bold text-white leading-none"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {stat.value}
                  <span className="text-lg text-slate-400">{stat.suffix}</span>
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">{stat.label}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
