'use client'

import { useState } from 'react'
import { useSessions } from '@/hooks/useSessions'
import { SessionGrid } from '@/components/sessions/SessionGrid'
import { SessionFilters } from '@/components/sessions/SessionFilters'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { GradientText } from '@/components/shared/GradientText'

export default function SessionsPage() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const { sessions, loading } = useSessions(category, query)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            All Sessions
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Browse <GradientText>Sessions</GradientText>
          </h1>
          <p className="mt-3 text-slate-400">
            {loading ? 'Loading…' : `${sessions.length} session${sessions.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {/* Filters */}
        <SessionFilters
          category={category}
          query={query}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
        />

        {/* Grid */}
        <SessionGrid sessions={sessions} loading={loading} />
      </div>
    </div>
  )
}
