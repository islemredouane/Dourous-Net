'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { CATEGORIES } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { CustomSelect } from '@/components/ui/custom-select'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionSort } from '@/hooks/useSessions'

interface SessionFiltersProps {
  readonly category: string
  readonly query: string
  readonly sort: SessionSort
  readonly freeOnly: boolean
  readonly onCategoryChange: (cat: string) => void
  readonly onQueryChange: (q: string) => void
  readonly onSortChange: (sort: SessionSort) => void
  readonly onFreeOnlyChange: (free: boolean) => void
  readonly onReset: () => void
}

export function SessionFilters({
  category,
  query,
  sort,
  freeOnly,
  onCategoryChange,
  onQueryChange,
  onSortChange,
  onFreeOnlyChange,
  onReset,
}: SessionFiltersProps) {
  const hasFilters = category !== 'all' || query.trim() !== '' || freeOnly || sort !== 'newest'
  const prefersReduced = useReducedMotion()

  return (
    <div className="mb-8 space-y-4 rounded-3xl border border-[#DDE3EC]/10 bg-[#121A2E] p-4 sm:p-5">
      {/* Top Row: Search + Sort + Free Toggle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F97C7]" />
          <Input
            type="text"
            placeholder="Search by title, topic, or discipline..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] pl-10 pr-10 text-sm text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A94A8] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort */}
          <CustomSelect
            id="session-sort"
            ariaLabel="Sort sessions"
            value={sort}
            onChange={(val) => onSortChange(val as SessionSort)}
            icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
            triggerClassName="h-11 rounded-full text-xs font-medium min-w-[175px]"
            align="right"
            options={[
              { value: 'newest', label: 'Newest first' },
              { value: 'duration_desc', label: 'Longest duration' },
              { value: 'duration_asc', label: 'Shortest duration' },
            ]}
          />

          {/* Free Only toggle */}
          <button
            type="button"
            onClick={() => onFreeOnlyChange(!freeOnly)}
            aria-pressed={freeOnly}
            className={cn(
              'h-11 px-5 rounded-full border text-xs font-mono font-semibold uppercase tracking-wider transition-colors',
              freeOnly
                ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                : 'border-[#DDE3EC]/15 bg-[#080E1D] text-[#8A94A8] hover:border-[#DDE3EC]/35 hover:text-white',
            )}
          >
            Free Only
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="h-11 px-4 rounded-full border border-[#DDE3EC]/15 text-xs text-[#AEC6FF] hover:border-[#3B82F6] hover:text-white transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#DDE3EC]/8">
        {CATEGORIES.map((cat) => {
          const active = category === cat.value
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onCategoryChange(cat.value)}
              aria-pressed={active}
              className={cn(
                'relative h-10 rounded-full px-4 text-[13px] font-medium border transition-colors',
                active
                  ? 'border-[#2563EB] text-white'
                  : 'border-[#DDE3EC]/12 bg-[#080E1D] text-[#8A94A8] hover:border-[#DDE3EC]/30 hover:text-white',
              )}
            >
              {active && (
                <motion.span
                  layoutId="catalog-category-pill"
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 32 }
                  }
                  className="absolute inset-0 z-0 rounded-full bg-[#2563EB]"
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
