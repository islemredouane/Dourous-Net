'use client'

import Link from 'next/link'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DISCIPLINES } from '@/lib/constants'
import { getDisciplineIcon } from '@/lib/discipline-icons'
import {
  ArrowRight,
  ChevronRight,
  Code2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExploreMegaMenuProps {
  open: boolean
  activeCategory: string
  onClose: () => void
  onOpenSearch: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const ExploreMegaMenu = forwardRef<HTMLDivElement, ExploreMegaMenuProps>(
  function ExploreMegaMenu(
    { open, activeCategory, onClose, onOpenSearch, onMouseEnter, onMouseLeave },
    drawerRef,
  ) {
    const defaultSlug = useMemo(() => {
      const matched = DISCIPLINES.find((d) => d.value === activeCategory)
      return matched?.value ?? DISCIPLINES[0].value
    }, [activeCategory])

    const [hoveredState, setHoveredState] = useState<{
      slug: string
      base: string
    } | null>(null)

    const currentSlug =
      open && hoveredState && hoveredState.base === defaultSlug
        ? hoveredState.slug
        : defaultSlug

    const previewDiscipline =
      DISCIPLINES.find((d) => d.value === currentSlug) ?? DISCIPLINES[0]

    useEffect(() => {
      if (!open) return
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }, [open, onClose])

    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Viewport scrim beneath fixed header */}
            <motion.div
              key="explore-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={onClose}
              aria-hidden="true"
              className="fixed inset-x-0 top-[calc(68px+var(--pwa-safe-top))] bottom-0 z-40 hidden lg:block bg-[#050811]/60 backdrop-blur-[2px]"
            />

            {/* Full-width Antigravity-inspired frosted drawer docked below navbar */}
            <motion.div
              ref={drawerRef}
              key="explore-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              role="region"
              aria-label="Explore academic disciplines"
              className="fixed inset-x-0 top-[calc(68px+var(--pwa-safe-top))] z-50 hidden lg:block border-b border-[#DDE3EC]/10 bg-[#0B1120]/96 backdrop-blur-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65)]"
            >
              <div className="mx-auto max-w-[1240px] px-5 md:px-10 py-8">
                <div className="grid grid-cols-12 gap-8 items-start">
                  {/* Left Column: Editorial Lead & Live Hover Spotlight */}
                  <div className="col-span-4 flex flex-col justify-between pr-6 border-r border-[#DDE3EC]/8 min-h-[252px]">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE3EC]/12 bg-[#121A2E]/90 px-3 py-1 text-[11px] font-medium text-[#AEC6FF]">
                        <Sparkles className="h-3 w-3 text-[#60A5FA]" />
                        <span>Curriculum Tracks</span>
                      </div>

                      <h3
                        className="mt-4 text-xl font-semibold tracking-tight text-white leading-snug"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                      >
                        {previewDiscipline.label}
                      </h3>

                      <p className="mt-2 text-[13.5px] leading-relaxed text-[#8A94A8]">
                        {previewDiscipline.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {previewDiscipline.topics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full bg-[#121A2E] px-2.5 py-1 text-[11px] font-medium text-[#DDE3EC]/80 border border-[#DDE3EC]/8"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#DDE3EC]/8 flex items-center justify-between gap-3">
                      <Link
                        href="/sessions"
                        onClick={onClose}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-5 text-[13px] font-semibold text-white transition-colors"
                      >
                        <span>Browse all courses</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          onClose()
                          onOpenSearch()
                        }}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs text-[#8A94A8] hover:text-white hover:bg-[#121A2E] transition-colors"
                      >
                        <span>Quick jump</span>
                        <kbd className="font-mono text-[10px] text-[#7F97C7]">⌘K</kbd>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Borderless Airy Two-Column Discipline Rows */}
                  <div className="col-span-8">
                    <div className="flex items-center justify-between px-3.5 pb-3">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#7F97C7]">
                        Six Core Disciplines
                      </span>
                      <span className="text-xs text-[#8A94A8]">
                        Hover to inspect syllabus · click to filter sessions
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {DISCIPLINES.map((d) => {
                        const Icon = getDisciplineIcon(d.value, Code2)
                        const isSelected = activeCategory === d.value
                        const isPreviewed = previewDiscipline.value === d.value

                        return (
                          <Link
                            key={d.value}
                            href={`/sessions?category=${encodeURIComponent(d.value)}`}
                            onClick={onClose}
                            onMouseEnter={() =>
                              setHoveredState({ slug: d.value, base: defaultSlug })
                            }
                            onFocus={() =>
                              setHoveredState({ slug: d.value, base: defaultSlug })
                            }
                            className={cn(
                              'group flex items-center justify-between gap-3.5 rounded-2xl px-3.5 py-3 transition-colors duration-150',
                              isSelected || isPreviewed
                                ? 'bg-[#121A2E]/95'
                                : 'hover:bg-[#121A2E]/80',
                            )}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#162038] transition-transform duration-200 group-hover:scale-105"
                                style={{ color: d.accent }}
                              >
                                <Icon className="h-[18px] w-[18px]" strokeWidth={1.85} />
                              </span>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      'text-[14.5px] font-medium transition-colors',
                                      isSelected
                                        ? 'text-[#AEC6FF]'
                                        : 'text-white group-hover:text-[#AEC6FF]',
                                    )}
                                  >
                                    {d.label}
                                  </span>
                                  {isSelected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                                  )}
                                </div>
                                <p className="mt-0.5 text-[12.5px] leading-snug text-[#8A94A8] group-hover:text-[#DDE3EC]/80 transition-colors">
                                  {d.tagline}
                                </p>
                              </div>
                            </div>

                            <ChevronRight className="h-4 w-4 shrink-0 text-[#7F97C7] opacity-0 -translate-x-1.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-white" />
                          </Link>
                        )
                      })}
                    </div>

                    {/* Subtle Footer Strip */}
                    <div className="mt-4 pt-3.5 px-3.5 border-t border-[#DDE3EC]/8 flex items-center justify-between text-xs text-[#8A94A8]">
                      <span>
                        Not sure where to start? Meet our instructors or read the platform guide.
                      </span>
                      <div className="flex items-center gap-4 shrink-0">
                        <Link
                          href="/teachers"
                          onClick={onClose}
                          className="inline-flex items-center gap-1 font-medium text-[#DDE3EC] hover:text-white transition-colors"
                        >
                          Instructors <ChevronRight className="h-3.5 w-3.5 text-[#7F97C7]" />
                        </Link>
                        <Link
                          href="/about"
                          onClick={onClose}
                          className="inline-flex items-center gap-1 font-medium text-[#DDE3EC] hover:text-white transition-colors"
                        >
                          How it works <ChevronRight className="h-3.5 w-3.5 text-[#7F97C7]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  },
)
