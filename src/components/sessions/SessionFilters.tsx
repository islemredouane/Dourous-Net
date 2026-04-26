'use client'

import { CATEGORIES } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionFiltersProps {
  readonly category: string
  readonly query: string
  readonly onCategoryChange: (cat: string) => void
  readonly onQueryChange: (q: string) => void
}

export function SessionFilters({
  category,
  query,
  onCategoryChange,
  onQueryChange,
}: SessionFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          type="text"
          placeholder="Search sessions..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-10 bg-white/5 border-indigo-500/20 text-white placeholder:text-slate-600 focus:border-indigo-500 h-11"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
              category === cat.value
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-glow-sm'
                : 'border-slate-700 bg-white/5 text-slate-400 hover:border-indigo-500/50 hover:text-slate-200',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
