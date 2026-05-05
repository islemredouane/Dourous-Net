'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { GradientText } from '@/components/shared/GradientText'
import { BookOpen, Users, BarChart2, Upload, Shield, Zap } from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Expert-Led Sessions',
    description: 'Curated courses from top Algerian teachers across all subjects — from Mathematics to Computer Science, Languages, and beyond.',
    gradient: 'from-indigo-600/30 via-indigo-500/10 to-transparent',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    glow: 'rgba(99,102,241,0.15)',
  },
  {
    icon: BarChart2,
    title: 'Track Your Progress',
    description: 'Real-time progress tracking, lesson completion status, and achievement milestones — all visible from your personal dashboard.',
    gradient: 'from-purple-600/30 via-purple-500/10 to-transparent',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: Upload,
    title: 'Submit Assignments',
    description: 'Upload your work directly in the platform — PDFs, documents, and files. Teachers receive submissions instantly, with no email required.',
    gradient: 'from-cyan-600/30 via-cyan-500/10 to-transparent',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    glow: 'rgba(6,182,212,0.15)',
  },
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Connect with fellow learners across Algeria. Study together, share notes, and grow faster through peer learning.',
    gradient: 'from-emerald-600/30 via-emerald-500/10 to-transparent',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Row-Level Security powered by Supabase ensures your data, submissions, and profile are only visible to you.',
    gradient: 'from-yellow-600/30 via-yellow-500/10 to-transparent',
    border: 'border-yellow-500/20',
    iconBg: 'bg-yellow-500/15',
    iconColor: 'text-yellow-400',
    glow: 'rgba(234,179,8,0.15)',
  },
  {
    icon: Zap,
    title: 'Learn Anywhere',
    description: 'Fully responsive across mobile, tablet, and desktop. Start a lesson on your phone, finish it on your laptop — seamlessly.',
    gradient: 'from-pink-600/30 via-pink-500/10 to-transparent',
    border: 'border-pink-500/20',
    iconBg: 'bg-pink-500/15',
    iconColor: 'text-pink-400',
    glow: 'rgba(236,72,153,0.15)',
  },
]

interface StackCardProps {
  feature: typeof FEATURES[0]
  index: number
  total: number
  progress: MotionValue<number>
}

function StackCard({ feature, index, total, progress }: StackCardProps) {
  const Icon = feature.icon

  // Each card scales down as the NEXT card comes in
  const scaleEnd = 1 - (total - 1 - index) * 0.04
  const scale = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [1, scaleEnd]
  )
  const opacity = useTransform(
    progress,
    [index / total, (index + 0.5) / total, (index + 1) / total],
    [1, 1, index === total - 1 ? 1 : 0.5]
  )

  const topOffset = 96 + index * 24

  return (
    <div
      className="sticky flex items-start justify-center"
      style={{ top: `${topOffset}px`, zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="w-full max-w-2xl"
      >
        <div
          className={`relative overflow-hidden rounded-3xl border ${feature.border} bg-[#0a0f1e]`}
          style={{ boxShadow: `0 0 60px ${feature.glow}, 0 0 0 1px rgba(255,255,255,0.04)` }}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} pointer-events-none`} />

          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

          <div className="relative p-6 md:p-10 flex flex-col gap-4 md:flex-row md:gap-6 md:items-start">
            {/* Icon */}
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${feature.iconBg} border ${feature.border}`}>
              <Icon className={`h-7 w-7 ${feature.iconColor}`} />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                  {feature.title}
                </h3>
                <span className={`hidden sm:inline-flex items-center rounded-full border ${feature.border} px-2.5 py-0.5 text-xs font-medium ${feature.iconColor} bg-transparent`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Why Dourous-Net
          </p>
          <h2 className="text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            <GradientText>Everything</GradientText> You Need to Learn
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            A complete digital learning ecosystem built for Algerian students and teachers.
          </p>
        </div>

        {/* Stack container */}
        <div
          ref={containerRef}
          style={{ height: `${FEATURES.length * 260}px` }}
          className="relative"
        >
          {FEATURES.map((feature, index) => (
            <StackCard
              key={feature.title}
              feature={feature}
              index={index}
              total={FEATURES.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
