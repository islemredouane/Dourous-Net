'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/shared/GlassCard'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { GradientText } from '@/components/shared/GradientText'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import {
  BookOpen, Users, BarChart2, Upload, Shield, Zap
} from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Expert-Led Sessions',
    description: 'Curated courses from top Algerian teachers across all subjects, from Mathematics to Computer Science.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: BarChart2,
    title: 'Track Your Progress',
    description: 'Visual progress bars, completion status, and achievement tracking across all your enrolled sessions.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Upload,
    title: 'Submit Assignments',
    description: 'Upload your work directly in the platform. Teachers receive submissions instantly, no email needed.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Connect with fellow learners across Algeria. Study groups, peer learning, and shared motivation.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Row-Level Security powered by Supabase. Your data, your submissions, your profile — protected.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Zap,
    title: 'Learn Anywhere',
    description: 'Fully responsive design optimized for mobile, tablet, and desktop. Your classroom is everywhere.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
]

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 md:py-32 relative"
    >
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          eyebrow="Why Dourous-Net"
          title={<><GradientText>Everything</GradientText> You Need to Learn</>}
          subtitle="A complete digital learning ecosystem built for Algerian students and teachers."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div key={feature.title} variants={fadeInUp}>
                <GlassCard glow className="h-full">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
