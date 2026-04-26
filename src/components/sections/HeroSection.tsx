'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeroScene } from '@/components/3d/HeroScene'
import { GradientText } from '@/components/shared/GradientText'
import { Button } from '@/components/ui/button'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { ArrowRight, Play, Star } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Canvas — full screen background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Hero glow overlay */}
      <div className="absolute inset-0 z-0 hero-glow pointer-events-none" />

      {/* Radial gradient at centre */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 md:py-40">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Eyebrow badge */}
          <motion.div variants={fadeInUp} className="mb-8 inline-flex">
            <span className="glass rounded-full px-4 py-2 text-sm font-medium text-indigo-400 border border-indigo-500/20">
              🇩🇿 {"Algeria's #1 Digital Academy"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-7xl"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Learn Without{' '}
            <GradientText>Limits</GradientText>
            <br />
            <span className="text-slate-300">Teach with Impact</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeInUp}
            className="mb-10 max-w-2xl text-xl text-slate-400 leading-relaxed"
          >
            Expert-led sessions in Mathematics, Computer Science, Languages, and more.
            Learn at your own pace, track your progress, and submit your work — all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth">
              <Button
                size="lg"
                className="group bg-indigo-500 text-white hover:bg-indigo-600 px-8 py-6 text-base shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
              >
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sessions">
              <Button
                size="lg"
                variant="outline"
                className="glass border-indigo-500/30 text-slate-300 hover:border-indigo-400 hover:text-white px-8 py-6 text-base group"
              >
                <Play className="mr-2 h-4 w-4 text-indigo-400" />
                Browse Sessions
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['YH', 'KB', 'NE', 'AZ'].map((initials) => (
                <div
                  key={initials}
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border-2 border-[#030712]"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="text-white font-semibold">12,000+</span> active students
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
    </section>
  )
}
