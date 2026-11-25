'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { SpotlightCard } from '@/components/shared/SpotlightCard'
import {
  Award,
  BarChart2,
  BookOpen,
  Bot,
  CloudUpload,
  GraduationCap,
  Layers,
  PlayCircle,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STUDENT_PILLARS = [
  {
    icon: PlayCircle,
    title: 'Multi-Source Video Curriculum',
    description:
      'Stream structured lessons embedded from YouTube, Google Drive, or Vimeo inside a distraction-free workspace with zero tab switching.',
    tag: 'Video Player',
  },
  {
    icon: Bot,
    title: 'Course-Aware AI Coach',
    description:
      'Ask conceptual questions while watching any lesson. Powered by Llama 3.3 via Groq, grounded in your course syllabus and category.',
    tag: 'AI Copilot',
    highlight: true,
  },
  {
    icon: Award,
    title: 'Timed Quizzes & Instant Review',
    description:
      'Practice with auto-timed multiple-choice assessments, receive instant percentage grades, and study per-question explanations.',
    tag: 'Assessments',
  },
  {
    icon: BarChart2,
    title: 'Live Completion Tracking',
    description:
      'Every completed lesson updates your course progress bar automatically and surfaces your next incomplete lesson on your dashboard.',
    tag: 'Progress Sync',
  },
  {
    icon: CloudUpload,
    title: 'Direct Assignment Submissions',
    description:
      'Upload PDF homework and lab reports directly from your student hub to private cloud storage linked straight to your instructor.',
    tag: 'Cloud Storage',
  },
  {
    icon: ShieldCheck,
    title: 'Private by Architecture',
    description:
      'PostgreSQL Row-Level Security guarantees your enrollments, quiz scores, and submitted PDFs stay isolated to your account.',
    tag: 'Supabase RLS',
  },
]

const TEACHER_PILLARS = [
  {
    icon: Layers,
    title: 'Publish Structured Sessions',
    description:
      'Create multi-module courses in minutes with category classification, duration estimates, custom thumbnails, and free open enrollment.',
    tag: 'Course Builder',
    highlight: true,
  },
  {
    icon: BookOpen,
    title: 'Ordered Curriculum Manager',
    description:
      'Add video lessons with YouTube or Google Drive links, set per-lesson durations, and organize sequence order cleanly.',
    tag: 'Lessons',
  },
  {
    icon: Award,
    title: 'Interactive Quiz Authoring',
    description:
      'Build custom MCQ quizzes with per-question point weights, countdown timers, and detailed answer explanations for learners.',
    tag: 'Quiz Studio',
  },
  {
    icon: Users,
    title: 'Student Submissions Inbox',
    description:
      'Review uploaded student PDFs from a single unified portal with student identity, course mapping, timestamps, and instant open links.',
    tag: 'Grading Hub',
  },
  {
    icon: BarChart2,
    title: 'Cohort & Score Analytics',
    description:
      'Monitor enrolled student counts, average quiz pass rates, and total published teaching hours directly from your Teacher Studio.',
    tag: 'Analytics',
  },
  {
    icon: GraduationCap,
    title: 'Public Educator Dossier',
    description:
      'Showcase your bio, specialty, academic level, and published catalog on a dedicated shareable instructor profile page.',
    tag: 'Instructor Page',
  },
]

export function FeaturesSection() {
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const prefersReduced = useReducedMotion()
  const items = role === 'student' ? STUDENT_PILLARS : TEACHER_PILLARS

  return (
    <section className="bg-[#F5F6F8] text-[#0B1120] py-20 sm:py-28 border-y border-[#1B2A55]/10">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <SectionTitle
            eyebrow="01 · Platform Architecture"
            title="Six pillars. Two workflows."
            subtitle="Designed equally for students mastering new disciplines and educators publishing structured curricula."
            center={false}
            tone="light"
            className="mb-0"
          />

          {/* Role Switcher with Framer Motion sliding full pill */}
          <div
            role="tablist"
            aria-label="Workflow perspective"
            className="relative inline-flex self-start lg:self-end rounded-full border border-[#1B2A55]/15 bg-white p-1 shadow-xs"
          >
            {(
              [
                { id: 'student' as const, label: 'For Students', pillBg: 'bg-[#0B1120]' },
                { id: 'teacher' as const, label: 'For Teachers', pillBg: 'bg-[#2563EB]' },
              ] as const
            ).map((opt) => {
              const active = role === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRole(opt.id)}
                  className={cn(
                    'relative rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider font-mono transition-colors',
                    active ? 'text-white' : 'text-[#3A4458] hover:text-[#0B1120]',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="features-role-pill"
                      transition={
                        prefersReduced
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 420, damping: 32 }
                      }
                      className={cn('absolute inset-0 z-0 rounded-full shadow-sm', opt.pillBg)}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Joined hairline matrix framed cleanly in rounded-2xl (Insight pattern) */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={role}
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-[#1B2A55]/12 bg-[#1B2A55]/10 shadow-xs"
          >
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <SpotlightCard
                  key={`${role}-${item.title}`}
                  tone="light"
                  className="rounded-none border-0 p-7 sm:p-8 bg-white hover:bg-[#F5F6F8] transition-colors"
                >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        'inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
                        item.highlight
                          ? 'border-[#2563EB] bg-[#2563EB] text-white'
                          : 'border-[#2563EB]/25 bg-[#2563EB]/[0.06] text-[#2563EB]',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#8A94A8]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3
                    className="mt-7 text-xl font-bold text-[#0B1120]"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#3A4458]">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <span className="inline-flex items-center rounded-full border border-[#1B2A55]/15 px-3 py-1 font-mono text-[11px] font-medium text-[#1B2A55]">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            )
          })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
