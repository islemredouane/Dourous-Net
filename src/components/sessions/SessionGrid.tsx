'use client'

import { motion } from 'framer-motion'
import { SessionCard } from './SessionCard'
import { staggerContainer, scaleIn } from '@/lib/animations'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { SessionWithTeacher } from '@/types'

interface SessionGridProps {
  readonly sessions: SessionWithTeacher[]
  readonly loading?: boolean
}

export function SessionGrid({ sessions, loading }: SessionGridProps) {
  if (loading) return <LoadingSpinner className="py-32" />

  if (sessions.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="mb-2 text-4xl">🎓</p>
        <p className="mb-2 text-lg text-slate-400">No sessions found</p>
        <p className="text-sm text-slate-600">Try a different category or search term.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {sessions.map((session) => (
        <motion.div key={session.id} variants={scaleIn}>
          <SessionCard session={session} />
        </motion.div>
      ))}
    </motion.div>
  )
}
