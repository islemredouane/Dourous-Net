'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/shared/GradientText'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative overflow-hidden py-24"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-6 text-4xl font-extrabold text-white md:text-6xl"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Ready to Start
            <br />
            <GradientText>Learning Today?</GradientText>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mb-10 max-w-2xl text-xl text-slate-400"
          >
            Join thousands of Algerian students already on Dourous-Net.
            Your first session is always free.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/auth">
              <Button
                size="lg"
                className="group bg-indigo-500 px-8 py-6 text-base text-white shadow-glow-md hover:bg-indigo-600 hover:shadow-glow-lg transition-all duration-300"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sessions">
              <Button
                size="lg"
                variant="outline"
                className="glass border-indigo-500/30 px-8 py-6 text-base text-slate-300 hover:border-indigo-400 hover:text-white"
              >
                Browse Sessions
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
