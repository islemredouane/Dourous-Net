'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSessions, type SessionSort } from '@/hooks/useSessions'
import { SessionGrid } from '@/components/sessions/SessionGrid'
import { SessionFilters } from '@/components/sessions/SessionFilters'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { DISCIPLINES } from '@/lib/constants'
import Link from 'next/link'

export function SessionsCatalogClient() {
  const searchParams = useSearchParams()

  const category = searchParams.get('category') || 'all'
  const urlQuery = searchParams.get('q') || ''
  const sort = (searchParams.get('sort') as SessionSort) || 'newest'
  const freeOnly = searchParams.get('free') === '1'

  const [queryDraft, setQueryDraft] = useState<{ base: string; value: string } | null>(null)
  const query = queryDraft && queryDraft.base === urlQuery ? queryDraft.value : urlQuery

  const syncUrl = (
    nextCategory: string,
    nextQuery: string,
    nextSort: SessionSort,
    nextFree: boolean,
  ) => {
    const params = new URLSearchParams()
    if (nextCategory && nextCategory !== 'all') params.set('category', nextCategory)
    if (nextQuery.length > 0 && nextQuery.trim().length > 0) params.set('q', nextQuery)
    if (nextSort !== 'newest') params.set('sort', nextSort)
    if (nextFree) params.set('free', '1')
    const qs = params.toString()
    window.history.replaceState(null, '', `/sessions${qs ? `?${qs}` : ''}`)
  }

  const handleCategoryChange = (cat: string) => {
    syncUrl(cat, query, sort, freeOnly)
  }

  const handleQueryChange = (q: string) => {
    setQueryDraft({ base: urlQuery, value: q })
    syncUrl(category, q, sort, freeOnly)
  }

  const handleSortChange = (s: SessionSort) => {
    syncUrl(category, query, s, freeOnly)
  }

  const handleFreeOnlyChange = (free: boolean) => {
    syncUrl(category, query, sort, free)
  }

  const handleReset = () => {
    setQueryDraft(null)
    window.history.replaceState(null, '', '/sessions')
  }

  const { sessions, loading } = useSessions(category, query, sort, freeOnly)
  const activeDiscipline = DISCIPLINES.find((d) => d.value === category)

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0B1120] pb-20">
        {/* Architectural Header */}
        <div className="relative pt-32 pb-14 border-b border-[#DDE3EC]/10 bg-[#080E1D] overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-[#7F97C7] mb-3">
                  {activeDiscipline
                    ? `Discipline ${activeDiscipline.code} · Catalog`
                    : 'Course Catalog · Algeria'}
                </p>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {activeDiscipline ? activeDiscipline.label : 'Browse Sessions'}
                </h1>
                <p className="mt-3 text-base text-[#94A3B8] max-w-2xl leading-relaxed">
                  {activeDiscipline
                    ? activeDiscipline.description
                    : 'Discover structured video curricula, timed quizzes, and AI-guided lessons created by Algerian educators.'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="rounded-xl border border-[#DDE3EC]/15 bg-[#121A2E] px-4 py-2.5 font-mono text-xs text-[#AEC6FF]">
                  {loading
                    ? 'Loading catalog...'
                    : `${sessions.length} ${sessions.length === 1 ? 'session' : 'sessions'}`}
                </div>
                <Link
                  href="/teachers"
                  className="inline-flex items-center h-10 rounded-full px-5 border border-[#DDE3EC]/15 text-xs font-medium text-[#DDE3EC] hover:border-[#3B82F6] hover:text-white transition-colors"
                >
                  Meet Educators →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters + Grid */}
        <div className="mx-auto max-w-[1240px] px-5 md:px-10 pt-8">
          <SessionFilters
            category={category}
            query={query}
            sort={sort}
            freeOnly={freeOnly}
            onCategoryChange={handleCategoryChange}
            onQueryChange={handleQueryChange}
            onSortChange={handleSortChange}
            onFreeOnlyChange={handleFreeOnlyChange}
            onReset={handleReset}
          />

          <SessionGrid sessions={sessions} loading={loading} onReset={handleReset} />
        </div>
      </div>
    </PageWrapper>
  )
}
