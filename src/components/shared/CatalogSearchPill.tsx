'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CustomSelect } from '@/components/ui/custom-select'
import { DISCIPLINES } from '@/lib/constants'
import { ArrowRight, Search } from 'lucide-react'

interface CatalogSearchPillProps {
  readonly placeholder?: string
  readonly selectId?: string
  readonly ctaLabel?: string
}

export function CatalogSearchPill({
  placeholder = 'Search algorithms, linear algebra, quantum physics, English...',
  selectId = 'catalog-category-select',
  ctaLabel = 'Search Courses',
}: CatalogSearchPillProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category !== 'all') params.set('category', category)
    const qs = params.toString()
    router.push(`/sessions${qs ? `?${qs}` : ''}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-1.5 md:rounded-full md:border md:border-[#DDE3EC]/15 md:bg-[#080E1D] md:p-1.5"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F97C7]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-full border border-[#DDE3EC]/15 bg-[#080E1D] pl-11 pr-4 text-sm text-white placeholder:text-[#8A94A8] focus:border-[#3B82F6] focus:outline-none md:border-0 md:bg-transparent md:focus:border-transparent"
        />
      </div>

      <div className="hidden md:block h-7 w-px bg-[#DDE3EC]/12 shrink-0" />

      <div className="md:w-60 shrink-0">
        <label htmlFor={selectId} className="sr-only">
          Discipline
        </label>
        <CustomSelect
          id={selectId}
          ariaLabel="Filter by discipline"
          value={category}
          onChange={setCategory}
          triggerClassName="h-12 rounded-full md:border-0 md:bg-transparent md:ring-0"
          options={[
            { value: 'all', label: 'All Disciplines' },
            ...DISCIPLINES.map((d) => ({
              value: d.value,
              label: d.label,
              hint: d.tagline,
            })),
          ]}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-7 text-sm font-semibold text-white transition-colors shrink-0"
      >
        <span>{ctaLabel}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  )
}
