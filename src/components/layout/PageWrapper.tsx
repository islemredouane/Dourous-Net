'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface PageWrapperProps {
  readonly children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
