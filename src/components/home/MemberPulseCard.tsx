import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PulseMetric {
  readonly label: string
  readonly dotClass: string
  readonly value: string | number
  readonly href: string
}

interface MemberPulseCardProps {
  readonly eyebrow: string
  readonly summary: string
  readonly actionLabel: string
  readonly actionHref: string
  readonly metrics: readonly [PulseMetric, PulseMetric, PulseMetric]
}

export function MemberPulseCard({
  eyebrow,
  summary,
  actionLabel,
  actionHref,
  metrics,
}: MemberPulseCardProps) {
  return (
    <div className="rounded-3xl border border-[#1B2A55]/12 bg-white shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2A55]/10 p-5 sm:p-6">
        <div>
          <p className="eyebrow text-[#2563EB]">{eyebrow}</p>
          <p className="mt-1.5 text-sm text-[#3A4458]">{summary}</p>
        </div>
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 h-11 rounded-full border border-[#1B2A55]/20 bg-white px-5 text-[13px] font-semibold text-[#0B1120] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors self-start sm:self-auto shrink-0"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 divide-x divide-[#1B2A55]/10">
        {metrics.map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className="group p-5 sm:p-6 hover:bg-[#F8FAFC] transition-colors"
          >
            <p className="flex items-center gap-2 font-mono text-[10px] sm:text-[10.5px] uppercase tracking-wider text-[#3A4458]">
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', m.dotClass)} />
              <span className="truncate">{m.label}</span>
            </p>
            <p
              className="mt-2 text-2xl sm:text-4xl font-bold tabular-nums text-[#0B1120]"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {m.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
