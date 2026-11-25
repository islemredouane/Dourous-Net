'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { DISCIPLINES } from '@/lib/constants'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { ArrowRight, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubjectsExplorerProps {
  categoryCounts: Record<string, number>
}

export function SubjectsExplorerSection({ categoryCounts }: SubjectsExplorerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const prefersReduced = useReducedMotion()
  const active = DISCIPLINES[selectedIndex]
  const count = categoryCounts[active.value] ?? 0

  return (
    <section className="relative bg-[#0B1120] py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-10">
        <SectionTitle
          eyebrow="02 · Academic Disciplines"
          title="Six tracks. One curriculum."
          subtitle="Select a discipline to inspect core topics and jump directly into available sessions."
          center={false}
          tone="dark"
        />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Numbered Discipline Selector (INSIGHT Compass style) */}
          <div
            role="tablist"
            aria-label="Academic disciplines"
            className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-2"
          >
            {DISCIPLINES.map((d, idx) => {
              const isSelected = idx === selectedIndex
              const dCount = categoryCounts[d.value] ?? 0
              return (
                <button
                  key={d.value}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    'relative flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left border transition-colors',
                    isSelected
                      ? 'border-[#3B82F6]/60 text-white'
                      : 'border-[#DDE3EC]/10 bg-[#121A2E]/70 text-[#DDE3EC]/75 hover:border-[#DDE3EC]/25 hover:text-white',
                  )}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="subjects-discipline-pill"
                      transition={
                        prefersReduced
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 420, damping: 32 }
                      }
                      className="absolute inset-0 z-0 rounded-xl bg-[#162038] shadow-sm shadow-[#2563EB]/15"
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3.5 min-w-0">
                    <span
                      className={cn(
                        'font-mono text-xs font-semibold',
                        isSelected ? 'text-[#AEC6FF]' : 'text-[#7F97C7]',
                      )}
                    >
                      {d.code}
                    </span>
                    <span
                      className="text-base font-bold truncate"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {d.label}
                    </span>
                  </div>
                  <span className="relative z-10 font-mono text-[11px] text-[#8A94A8] shrink-0">
                    {dCount} {dCount === 1 ? 'session' : 'sessions'}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right: Active Discipline Architectural Dossier */}
          <div className="lg:col-span-7 rounded-3xl border border-[#DDE3EC]/12 bg-[#121A2E] p-7 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.value}
                initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#DDE3EC]/10">
                  <div>
                    <p className="eyebrow text-[#7F97C7]">
                      Discipline {active.code} · {active.tagline}
                    </p>
                    <h3
                      className="mt-2 text-3xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {active.label}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE3EC]/15 bg-[#080E1D] px-3.5 py-2 font-mono text-xs text-[#AEC6FF]">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>
                      {count} Published {count === 1 ? 'Session' : 'Sessions'}
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-[15.5px] leading-relaxed text-[#DDE3EC]/80">
                  {active.description}
                </p>

                <div className="mt-7">
                  <p className="eyebrow text-[#8A94A8] mb-3">Core Topics Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {active.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg border border-[#7F97C7]/25 bg-[#080E1D] px-3 py-1.5 font-mono text-xs text-[#DDE3EC]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-9 pt-6 border-t border-[#DDE3EC]/10 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href={`/sessions?category=${encodeURIComponent(active.value)}`}
                    className="group inline-flex items-center gap-2.5 h-11 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
                  >
                    <span>Explore {active.label}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/sessions"
                    className="text-xs font-mono uppercase tracking-wider text-[#AEC6FF] hover:text-white transition-colors"
                  >
                    View full catalog →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
