'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface StatsSectionProps {
  sessionsCount: number
  teachersCount: number
  lessonsCount: number
  quizzesCount: number
}

function CountUp({ target }: { readonly target: number }) {
  const [count, setCount] = useState(target)
  const { ref, isVisible } = useScrollAnimation(0.25)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current || target === 0) return
    hasAnimated.current = true
    let frame = 0
    const totalFrames = 28
    const timer = setInterval(() => {
      frame += 1
      const next = Math.round((frame / totalFrames) * target)
      setCount(next)
      if (frame >= totalFrames) {
        setCount(target)
        clearInterval(timer)
      }
    }, 24)
    return () => clearInterval(timer)
  }, [isVisible, target])

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {count.toLocaleString()}
    </span>
  )
}

export function StatsSection({
  sessionsCount,
  teachersCount,
  lessonsCount,
  quizzesCount,
}: StatsSectionProps) {
  const metrics = [
    { value: sessionsCount, label: 'Published Sessions' },
    { value: teachersCount, label: 'Educators' },
    { value: lessonsCount, label: 'Video Lessons' },
    { value: quizzesCount, label: 'Interactive Quizzes' },
  ]

  return (
    <section className="bg-white text-[#0B1120] border-y border-[#1B2A55]/10 py-16 sm:py-20">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 sm:divide-x divide-[#1B2A55]/12 flex-1">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className={
                idx === 0
                  ? 'sm:pr-8'
                  : idx === metrics.length - 1
                  ? 'sm:pl-8'
                  : 'sm:px-8'
              }
            >
              <dt className="sr-only">{m.label}</dt>
              <dd
                className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-[#0B1120]"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                <CountUp target={m.value} />
              </dd>
              <dd className="mt-2 eyebrow text-[#3A4458]">{m.label}</dd>
            </div>
          ))}
        </dl>

        <p
          className="lg:max-w-sm lg:border-l lg:border-[#1B2A55]/12 lg:pl-10 text-xl sm:text-2xl font-medium leading-snug text-[#1B2A55]"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Live PostgreSQL catalog. Zero tuition barriers. Built for students across Algeria.
        </p>
      </div>
    </section>
  )
}
