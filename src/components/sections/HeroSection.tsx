'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useUser } from '@/hooks/useUser'
import { HeroScene } from '@/components/3d/HeroScene'
import { BlurText } from '@/components/shared/BlurText'
import { CatalogSearchPill } from '@/components/shared/CatalogSearchPill'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Sparkles,
} from 'lucide-react'

const QUICK_TOPICS = [
  { label: 'Algorithms', q: 'Algorithmes' },
  { label: 'React & Next.js', q: 'React' },
  { label: 'Linear Algebra', q: 'Algèbre' },
  { label: 'Quantum Physics', q: 'Quantique' },
  { label: 'Technical English', q: 'Anglais' },
]

export function HeroSection() {
  const { user, profile, loading } = useUser()
  const prefersReduced = useReducedMotion()

  return (
    <section className="relative min-h-[94vh] flex items-center bg-[#0B1120] pt-24 pb-16 sm:pt-28 sm:pb-20">
      {/* Dot matrix + ambient subtle 3D geometry clipped separately so popovers never clip */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-dots opacity-25" />
        <div className="absolute inset-0 z-0 opacity-70">
          <HeroScene />
        </div>
        <div className="absolute inset-0 z-0 hero-glow" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 md:px-10">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0, ease: [0.2, 0.7, 0.2, 1] }}
            className="mb-6 inline-flex max-w-full items-center gap-2.5 sm:gap-3 rounded-full border border-[#DDE3EC]/15 bg-[#121A2E]/90 px-3.5 sm:px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono font-semibold uppercase text-[9.5px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.16em] text-[#AEC6FF] truncate whitespace-nowrap">
              Algeria&apos;s Digital Academy · Free &amp; Open
            </span>
          </motion.div>

          {/* Display Headline */}
          <BlurText
            as="h1"
            delay={0.04}
            text="Structured courses. Built for mastery."
            className="text-4xl sm:text-6xl lg:text-[68px] font-bold tracking-[-0.03em] leading-[1.03] text-white"
          />

          {/* Editorial Quote / Subtitle */}
          <motion.p
            initial={
              prefersReduced
                ? false
                : { opacity: 0, y: 12, filter: 'blur(4px)' }
            }
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.42,
              delay: 0.24,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            className="mt-6 max-w-2xl border-l-2 border-[#2563EB] pl-5 text-lg sm:text-xl text-[#DDE3EC]/80 leading-relaxed italic"
            style={{ fontFamily: 'var(--font-lora), Georgia, serif' }}
          >
            &ldquo;Learn from Algerian educators at your own pace — video curricula, instant-graded quizzes, and a context-aware AI coach in one place.&rdquo;
          </motion.p>

          {/* Dual Primary CTAs */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.36,
              delay: 0.34,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            {loading ? (
              <div className="h-12 w-48 rounded-full bg-[#121A2E] border border-[#DDE3EC]/15 animate-pulse" />
            ) : user ? (
              <Link
                href={profile?.role === 'teacher' ? '/teacher' : '/dashboard'}
                className="group inline-flex items-center gap-2.5 h-12 rounded-full px-7 bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
              >
                <span>
                  {profile?.role === 'teacher' ? 'Open Teacher Studio' : 'Go to Dashboard'}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href="/auth"
                className="group inline-flex items-center gap-2.5 h-12 rounded-full px-7 bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 h-12 rounded-full px-7 border border-[#DDE3EC]/25 bg-[#121A2E]/70 text-sm font-medium text-[#DDE3EC] hover:border-[#AEC6FF] hover:text-white transition-colors"
            >
              <Compass className="h-4 w-4 text-[#AEC6FF]" />
              <span>Browse Catalog</span>
            </Link>
          </motion.div>
        </div>

        {/* Medlink-inspired Command Hub Search Frame */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.42,
            ease: [0.2, 0.7, 0.2, 1],
          }}
          className="mt-12 rounded-3xl border border-[#DDE3EC]/12 bg-[#0E1526]/95 p-4 sm:p-5 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDE3EC]/10 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="eyebrow text-[#AEC6FF]">Catalog Search Hub</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A94A8]">
              <span className="hidden sm:inline rounded-full border border-[#DDE3EC]/12 px-2.5 py-0.5">
                YouTube · Drive · Vimeo
              </span>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-300">
                100% Free Access
              </span>
            </div>
          </div>

          <CatalogSearchPill selectId="hero-category" />

          {/* Quick Topic Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8A94A8] mr-1">
              Popular:
            </span>
            {QUICK_TOPICS.map((t) => (
              <Link
                key={t.q}
                href={`/sessions?q=${encodeURIComponent(t.q)}`}
                className="rounded-full border border-[#DDE3EC]/12 bg-[#121A2E] px-3 py-1 text-xs text-[#DDE3EC]/85 hover:border-[#3B82F6]/50 hover:text-white transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.36,
            delay: 0.5,
            ease: [0.2, 0.7, 0.2, 1],
          }}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-[#94A3B8]"
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Instant progress &amp; quiz grading</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#60A5FA]" />
            <span>Context-aware AI Coach inside every lesson</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#AEC6FF]" />
            <span>Built for Algerian students &amp; teachers</span>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
