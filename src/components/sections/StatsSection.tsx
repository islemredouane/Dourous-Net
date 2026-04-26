'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { GradientText } from '@/components/shared/GradientText'

const STATS = [
  { value: 500, suffix: '+', label: 'Sessions Published' },
  { value: 12000, suffix: '+', label: 'Active Students' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
  { value: 50, suffix: '+', label: 'Expert Teachers' },
]

function CountUp({ target, suffix }: { readonly target: number; readonly suffix: string }) {
  const [count, setCount] = useState(0)
  const { ref, isVisible } = useScrollAnimation(0.3)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!isVisible || hasRun.current) return
    hasRun.current = true
    const steps = 60
    const step = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 25)
    return () => clearInterval(timer)
  }, [isVisible, target])

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20"
    >
      {/* Background strip */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5" />

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-8 text-center md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <div
                className="mb-2 text-4xl font-extrabold md:text-5xl"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                <GradientText>
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </GradientText>
              </div>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
