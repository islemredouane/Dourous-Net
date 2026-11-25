import Link from 'next/link'
import { CatalogSearchPill } from '@/components/shared/CatalogSearchPill'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MemberQuickAction {
  readonly href: string
  readonly title: string
  readonly subtitle: string
  readonly icon: React.ReactNode
  readonly accentClass: string
  readonly hoverBorderClass: string
}

interface MemberWelcomeBandProps {
  readonly eyebrow: string
  readonly firstName: string
  readonly prompt: string
  readonly searchSelectId: string
  readonly actions: readonly [MemberQuickAction, MemberQuickAction]
}

export function MemberWelcomeBand({
  eyebrow,
  firstName,
  prompt,
  searchSelectId,
  actions,
}: MemberWelcomeBandProps) {
  return (
    <section className="relative bg-[#0B1120] pt-28 pb-12 sm:pt-32 sm:pb-16 border-b border-[#DDE3EC]/10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute -right-32 -top-44 h-[480px] w-[480px] rounded-full bg-[#2563EB]/18 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="min-w-0">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E]/90 px-3.5 py-1.5 eyebrow text-[10px] sm:text-[11px] text-[#AEC6FF]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="truncate whitespace-nowrap">{eyebrow}</span>
          </span>

          <h1
            className="mt-5 text-3xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.06] text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Welcome back, {firstName}.
            <span
              className="mt-1.5 block text-2xl sm:text-3xl lg:text-[2rem] font-normal italic text-[#AEC6FF]"
              style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
            >
              {prompt}
            </span>
          </h1>

          <div className="mt-7">
            <CatalogSearchPill selectId={searchSelectId} />
          </div>
        </div>

        {/* Two quick task cards (Medlink home-member pattern) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {actions.map((action) => (
            <Link
              key={action.href + action.title}
              href={action.href}
              className={cn(
                'group flex items-center gap-4 rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E]/90 p-4 sm:p-5 transition-colors hover:bg-[#162038]',
                action.hoverBorderClass,
              )}
            >
              <span
                className={cn(
                  'grid h-11 w-11 shrink-0 place-items-center rounded-xl border',
                  action.accentClass,
                )}
              >
                {action.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-white truncate">
                  {action.title}
                </span>
                <span className="mt-0.5 block text-xs text-[#94A3B8] truncate">
                  {action.subtitle}
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8A94A8] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
