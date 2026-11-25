'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { SpotlightCard } from '@/components/shared/SpotlightCard'
import { Input } from '@/components/ui/input'
import { ArrowUpRight, BookOpen, GraduationCap, Search, User } from 'lucide-react'
import type { Student } from '@/types'

export interface TeacherSummary extends Student {
  sessionCount: number
  categories: string[]
}

export function TeachersDirectoryClient({
  teachers,
}: {
  teachers: TeacherSummary[]
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return teachers
    return teachers.filter(
      (t) =>
        t.full_name.toLowerCase().includes(q) ||
        (t.field?.toLowerCase().includes(q) ?? false) ||
        (t.bio?.toLowerCase().includes(q) ?? false) ||
        t.categories.some((c) => c.toLowerCase().includes(q)),
    )
  }, [teachers, query])

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7F97C7]" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter instructors by name, field, or subject..."
            className="h-11 rounded-xl border-[#DDE3EC]/15 bg-[#080E1D] pl-10 text-sm text-white placeholder:text-[#8A94A8] focus-visible:border-[#3B82F6] focus-visible:ring-0"
          />
        </div>
        <p className="font-mono text-xs text-[#AEC6FF]">
          {filtered.length} educator{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] py-20 px-4 text-center">
          <GraduationCap className="mx-auto h-8 w-8 text-[#7F97C7] mb-3" />
          <p className="text-lg font-bold text-white">No educators match your filter</p>
          <p className="text-sm text-[#94A3B8] mt-1">
            Clear your search to browse all instructors on Dourous-Net.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Link key={t.id} href={`/teachers/${t.id}`} className="block group h-full">
              <SpotlightCard tone="dark" className="h-full p-6 flex flex-col">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1B2A55] border border-[#3B82F6]/30 text-lg font-bold text-[#AEC6FF] overflow-hidden">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.full_name} className="h-full w-full object-cover" />
                    ) : t.full_name ? (
                      t.full_name.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2
                      className="text-lg font-bold text-white group-hover:text-[#AEC6FF] transition-colors truncate"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {t.full_name}
                    </h2>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#7F97C7] mt-0.5 truncate">
                      {t.field || `${t.level} Educator`}
                    </p>
                  </div>
                </div>

                {t.bio && (
                  <p className="mt-4 text-[13.5px] leading-relaxed text-[#94A3B8] line-clamp-3">
                    {t.bio}
                  </p>
                )}

                {t.categories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {t.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="rounded-md border border-[#7F97C7]/25 bg-[#080E1D] px-2.5 py-0.5 font-mono text-[10.5px] text-[#DDE3EC]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-5 mt-5 border-t border-[#DDE3EC]/10 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[#8A94A8]">
                    <BookOpen className="h-3.5 w-3.5 text-[#7F97C7]" />
                    {t.sessionCount} {t.sessionCount === 1 ? 'session' : 'sessions'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#AEC6FF] group-hover:translate-x-0.5 transition-transform">
                    View Dossier <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
