'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/shared/GlassCard'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, scaleIn } from '@/lib/animations'
import { Quote, Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Yasmine Hadj',
    role: 'Computer Science Student, USTHB',
    text: 'Dourous-Net changed how I study programming. The sessions are structured perfectly, and the progress tracking keeps me motivated every single day.',
    avatar: 'YH',
    stars: 5,
  },
  {
    name: 'Karim Bensaid',
    role: 'Mathematics Teacher, Algiers',
    text: "As a teacher, creating sessions is effortless. My students love the interface, and I can track everyone's submissions without leaving the dashboard.",
    avatar: 'KB',
    stars: 5,
  },
  {
    name: 'Nour El-Houda',
    role: 'High School Student, Oran',
    text: 'Finally, an Algerian platform that actually feels modern. The design is world-class, and the learning experience is incredibly smooth.',
    avatar: 'NE',
    stars: 5,
  },
]

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          eyebrow="Testimonials"
          title="Loved by Learners"
          subtitle="Join thousands of Algerian students and teachers who already trust Dourous-Net."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={scaleIn}>
              <GlassCard glow className="flex h-full flex-col">
                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <Quote className="mb-4 h-7 w-7 text-indigo-500/40" />

                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-300">
                  {t.text}
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
