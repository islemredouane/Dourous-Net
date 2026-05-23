'use client'

import { useState } from 'react'
import { useSessions } from '@/hooks/useSessions'
import { SessionGrid } from '@/components/sessions/SessionGrid'
import { SessionFilters } from '@/components/sessions/SessionFilters'
import { GradientText } from '@/components/shared/GradientText'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function SessionsPage() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const { sessions, loading } = useSessions(category, query)

  return (
    <PageWrapper>
      <div className="min-h-screen pb-16">
        {/* Immersive Header */}
        <div className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-indigo-900/40 via-slate-900/80 to-[#030614]">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Discover Knowledge
            </p>
            <h1 className="text-5xl font-bold text-white md:text-7xl tracking-tight mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Browse <GradientText>Sessions</GradientText>
            </h1>
            <p className="mt-4 text-lg text-indigo-200/70 max-w-2xl mx-auto">
              Find the perfect course to enhance your skills. Learn from top educators around the country.
            </p>
            <p className="mt-6 text-sm font-medium text-slate-500">
              {loading ? 'Finding sessions...' : `Showing ${sessions.length} session${sessions.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4">
          {/* Filters */}
          <div className="py-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <SessionFilters
              category={category}
              query={query}
              onCategoryChange={setCategory}
              onQueryChange={setQuery}
            />
          </div>

          {/* Grid */}
          <SessionGrid sessions={sessions} loading={loading} />
        </div>
      </div>
    </PageWrapper>
  )
}
