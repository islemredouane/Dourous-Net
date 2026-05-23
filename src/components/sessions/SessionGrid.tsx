'use client'

import { motion } from 'framer-motion'
import { SessionCard } from './SessionCard'
import { staggerContainer, scaleIn } from '@/lib/animations'
import { SessionGridSkeleton } from './SessionGridSkeleton'
import { SearchX } from 'lucide-react'
import type { SessionWithTeacher } from '@/types'

interface SessionGridProps {
  readonly sessions: SessionWithTeacher[]
  readonly loading?: boolean
}

export function SessionGrid({ sessions, loading }: SessionGridProps) {
  if (loading) return <SessionGridSkeleton />

  if (sessions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 mb-6">
          <SearchX className="h-10 w-10 text-indigo-400" />
        </div>
        <h3 className="mb-2 text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          No sessions found
        </h3>
        <p className="max-w-sm text-slate-400">
          We couldn't find any sessions matching your current filters. Try adjusting your search or category.
        </p>
      </motion.div>
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
