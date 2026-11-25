'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { DISCIPLINES } from '@/lib/constants'
import { getDisciplineAccent, getDisciplineIcon } from '@/lib/discipline-icons'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  BookOpen,
  Code2,
  Compass,
  CornerDownLeft,
  GraduationCap,
  LayoutDashboard,
  Search,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react'

interface QuickSession {
  id: string
  title: string
  category: string
  duration_hours: number
  teacher_name?: string
}

interface QuickTeacher {
  id: string
  full_name: string
  field: string | null
}

type CommandGroup = 'action' | 'session' | 'discipline' | 'teacher'

interface CommandEntry {
  uid: string
  group: CommandGroup
  title: string
  subtitle?: string
  href: string
  accent?: string
  badge?: string
  icon?: LucideIcon
  initials?: string
}

interface CommandPaletteContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const QUICK_ROUTES: { label: string; subtitle: string; href: string; icon: LucideIcon }[] = [
  { label: 'Course Catalog', subtitle: 'Browse all live sessions', href: '/sessions', icon: BookOpen },
  { label: 'Educators Directory', subtitle: 'Meet verified instructors', href: '/teachers', icon: GraduationCap },
  { label: 'Student Dashboard', subtitle: 'Enrollments & progress', href: '/dashboard', icon: LayoutDashboard },
  { label: 'How It Works', subtitle: 'Architecture & workflow', href: '/about', icon: Compass },
]

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
})

export function useCommandPalette() {
  return useContext(CommandPaletteContext)
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'T'
}

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpenState] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [sessions, setSessions] = useState<QuickSession[]>([])
  const [teachers, setTeachers] = useState<QuickTeacher[]>([])
  const [loaded, setLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next)
    if (next) setActiveIndex(0)
  }, [])

  const toggle = useCallback(() => {
    setOpenState((v) => {
      const next = !v
      if (next) setActiveIndex(0)
      return next
    })
  }, [])

  // Keyboard shortcuts: Cmd/Ctrl + K and Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggle()
      } else if (e.key === 'Escape') {
        setOpenState(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  // Focus input smoothly and lock scroll without horizontal scrollbar jump
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const raf = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true })
    })

    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
    }
  }, [open])

  // Lazy-fetch index once opened
  useEffect(() => {
    if (!open || loaded) return

    const supabase = createClient()
    Promise.all([
      supabase
        .from('sessions')
        .select('id, title, category, duration_hours, teacher:students(full_name)')
        .order('created_at', { ascending: false })
        .limit(24),
      supabase
        .from('students')
        .select('id, full_name, field')
        .eq('role', 'teacher')
        .limit(12),
    ]).then(
      ([sRes, tRes]) => {
        const mappedSessions: QuickSession[] = (sRes.data ?? []).map(
          (item: {
            id: string
            title: string
            category: string
            duration_hours: number
            teacher: { full_name: string } | null
          }) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            duration_hours: item.duration_hours,
            teacher_name: item.teacher?.full_name,
          }),
        )
        setSessions(mappedSessions)
        setTeachers((tRes.data ?? []) as QuickTeacher[])
        setLoaded(true)
      },
      () => {
        setLoaded(true)
      },
    )
  }, [open, loaded])

  const normalized = query.trim().toLowerCase()

  const filteredSessions = useMemo(() => {
    if (!normalized) return sessions.slice(0, 4)
    return sessions
      .filter(
        (s) =>
          s.title.toLowerCase().includes(normalized) ||
          s.category.toLowerCase().includes(normalized) ||
          (s.teacher_name?.toLowerCase().includes(normalized) ?? false),
      )
      .slice(0, 6)
  }, [sessions, normalized])

  const filteredDisciplines = useMemo(() => {
    if (!normalized) return DISCIPLINES
    return DISCIPLINES.filter(
      (d) =>
        d.label.toLowerCase().includes(normalized) ||
        d.tagline.toLowerCase().includes(normalized),
    )
  }, [normalized])

  const filteredTeachers = useMemo(() => {
    if (!normalized) return teachers.slice(0, 3)
    return teachers
      .filter(
        (t) =>
          t.full_name.toLowerCase().includes(normalized) ||
          (t.field?.toLowerCase().includes(normalized) ?? false),
      )
      .slice(0, 4)
  }, [teachers, normalized])

  // Single keyboard-navigable list mirroring rendered sections
  const commandEntries = useMemo<CommandEntry[]>(() => {
    const list: CommandEntry[] = []

    if (normalized) {
      list.push({
        uid: 'action:search-catalog',
        group: 'action',
        title: `Search catalog for "${query.trim()}"`,
        subtitle: 'Open full course directory with query filter',
        href: `/sessions?q=${encodeURIComponent(query.trim())}`,
        icon: Search,
        badge: 'Catalog Search',
      })
    } else {
      for (const route of QUICK_ROUTES) {
        list.push({
          uid: `action:${route.href}`,
          group: 'action',
          title: route.label,
          subtitle: route.subtitle,
          href: route.href,
          icon: route.icon,
        })
      }
    }

    for (const s of filteredSessions) {
      list.push({
        uid: `session:${s.id}`,
        group: 'session',
        title: s.title,
        subtitle: [
          s.category,
          s.teacher_name,
          s.duration_hours > 0 ? `${s.duration_hours}h` : null,
        ]
          .filter(Boolean)
          .join(' · '),
        href: `/sessions/${s.id}`,
        icon: getDisciplineIcon(s.category, BookOpen),
        accent: getDisciplineAccent(s.category),
        badge: s.category,
      })
    }

    for (const d of filteredDisciplines) {
      list.push({
        uid: `discipline:${d.value}`,
        group: 'discipline',
        title: d.label,
        subtitle: d.tagline,
        href: `/sessions?category=${encodeURIComponent(d.value)}`,
        icon: getDisciplineIcon(d.value, Code2),
        accent: d.accent,
        badge: d.code,
      })
    }

    for (const t of filteredTeachers) {
      list.push({
        uid: `teacher:${t.id}`,
        group: 'teacher',
        title: t.full_name,
        subtitle: t.field ?? 'Verified Instructor',
        href: `/teachers/${t.id}`,
        initials: getInitials(t.full_name),
      })
    }

    return list
  }, [filteredDisciplines, filteredSessions, filteredTeachers, normalized, query])

  const entryIndexByUid = useMemo(() => {
    const map = new Map<string, number>()
    commandEntries.forEach((entry, idx) => map.set(entry.uid, idx))
    return map
  }, [commandEntries])

  const clampedActiveIndex =
    commandEntries.length > 0
      ? Math.min(activeIndex, commandEntries.length - 1)
      : -1

  const navigate = useCallback(
    (href: string) => {
      setOpenState(false)
      setQuery('')
      setActiveIndex(0)
      router.push(href)
    },
    [router],
  )

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (commandEntries.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (clampedActiveIndex + 1) % commandEntries.length
      setActiveIndex(next)
      document
        .getElementById(`cmd-item-${commandEntries[next].uid}`)
        ?.scrollIntoView({ block: 'nearest' })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev =
        (clampedActiveIndex - 1 + commandEntries.length) % commandEntries.length
      setActiveIndex(prev)
      document
        .getElementById(`cmd-item-${commandEntries[prev].uid}`)
        ?.scrollIntoView({ block: 'nearest' })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const activeEntry =
        clampedActiveIndex >= 0 ? commandEntries[clampedActiveIndex] : null
      if (activeEntry) {
        navigate(activeEntry.href)
      } else if (query.trim()) {
        navigate(`/sessions?q=${encodeURIComponent(query.trim())}`)
      } else {
        navigate('/sessions')
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (clampedActiveIndex >= 0 && commandEntries[clampedActiveIndex]) {
      navigate(commandEntries[clampedActiveIndex].href)
    } else if (query.trim()) {
      navigate(`/sessions?q=${encodeURIComponent(query.trim())}`)
    } else {
      navigate('/sessions')
    }
  }

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            key="cmd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] sm:pt-[12vh] bg-[#040711]/72 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Quick search"
            onClick={() => setOpen(false)}
          >
            <motion.div
              key="cmd-dialog"
              initial={{ opacity: 0, scale: 0.96, y: -14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[660px] overflow-hidden rounded-[26px] border border-[#DDE3EC]/14 bg-[#0B1120]/94 backdrop-blur-2xl shadow-[0_36px_90px_-18px_rgba(0,0,0,0.85),0_0_0_1px_rgba(174,198,255,0.06)]"
            >
              {/* Top specular hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA]/50 to-transparent"
              />

              {/* Command Input Header */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3.5 border-b border-[#DDE3EC]/10 px-5 py-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#121A2E] text-[#60A5FA]">
                  <Search className="h-4 w-4" />
                </span>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActiveIndex(0)
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search courses, disciplines, teachers, or jump to a page..."
                  className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#7F8CA6] focus:outline-none"
                />

                <div className="flex items-center gap-2 shrink-0">
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('')
                        setActiveIndex(0)
                        inputRef.current?.focus()
                      }}
                      className="rounded-full bg-[#121A2E] hover:bg-[#1B2A55] px-2.5 py-1 text-[11px] font-medium text-[#AEC6FF] transition-colors"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close search"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#8A94A8] hover:bg-[#121A2E] hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>

              {/* Scrollable Command Results */}
              <div className="max-h-[58vh] overflow-y-auto px-3 py-3 space-y-4">
                {/* Query Action Row (when typing) */}
                {normalized && (() => {
                  const uid = 'action:search-catalog'
                  const idx = entryIndexByUid.get(uid) ?? -1
                  const active = idx === clampedActiveIndex

                  return (
                    <div>
                      <button
                        id={`cmd-item-${uid}`}
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() =>
                          navigate(`/sessions?q=${encodeURIComponent(query.trim())}`)
                        }
                        className={cn(
                          'group flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-colors',
                          active ? 'bg-[#162038]' : 'hover:bg-[#121A2E]',
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/20 text-[#60A5FA]">
                            <Sparkles className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-medium text-white truncate">
                              Search catalog for{' '}
                              <span className="text-[#AEC6FF]">
                                &ldquo;{query.trim()}&rdquo;
                              </span>
                            </p>
                            <p className="text-[11.5px] text-[#8A94A8]">
                              Jump straight to filtered courses
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-mono transition-opacity shrink-0',
                            active
                              ? 'bg-[#2563EB]/20 text-[#AEC6FF] opacity-100'
                              : 'text-[#7F97C7] opacity-60 group-hover:opacity-100',
                          )}
                        >
                          <CornerDownLeft className="h-3 w-3" />
                        </span>
                      </button>
                    </div>
                  )
                })()}

                {/* Quick Navigation Pills (when empty query) */}
                {!normalized && (
                  <div>
                    <p className="px-2.5 pb-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#7F97C7]">
                      Quick Jump
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {QUICK_ROUTES.map((route) => {
                        const uid = `action:${route.href}`
                        const idx = entryIndexByUid.get(uid) ?? -1
                        const active = idx === clampedActiveIndex
                        const Icon = route.icon

                        return (
                          <button
                            id={`cmd-item-${uid}`}
                            key={route.href}
                            type="button"
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => navigate(route.href)}
                            className={cn(
                              'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors',
                              active ? 'bg-[#162038]' : 'hover:bg-[#121A2E]/85',
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                                active
                                  ? 'bg-[#2563EB] text-white'
                                  : 'bg-[#121A2E] text-[#60A5FA]',
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13px] font-medium text-white truncate">
                                {route.label}
                              </span>
                              <span className="block text-[11px] text-[#8A94A8] truncate">
                                {route.subtitle}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Sessions */}
                <div>
                  <div className="flex items-center justify-between px-2.5 pb-1.5">
                    <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#7F97C7]">
                      {normalized ? 'Matching Courses' : 'Featured & Latest Courses'}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          query.trim()
                            ? `/sessions?q=${encodeURIComponent(query.trim())}`
                            : '/sessions',
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#AEC6FF] hover:text-white transition-colors"
                    >
                      All courses <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {!loaded ? (
                    <div className="space-y-1.5 px-1">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="h-12 rounded-2xl bg-[#121A2E]/60 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : filteredSessions.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-[#8A94A8]">
                      No direct course title matches &ldquo;{query.trim()}&rdquo; — press Enter to search the full catalog.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {filteredSessions.map((s) => {
                        const uid = `session:${s.id}`
                        const idx = entryIndexByUid.get(uid) ?? -1
                        const active = idx === clampedActiveIndex
                        const Icon = getDisciplineIcon(s.category, BookOpen)
                        const accent = getDisciplineAccent(s.category)

                        return (
                          <button
                            id={`cmd-item-${uid}`}
                            key={s.id}
                            type="button"
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => navigate(`/sessions/${s.id}`)}
                            className={cn(
                              'group flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors',
                              active ? 'bg-[#162038]' : 'hover:bg-[#121A2E]/85',
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#121A2E]"
                                style={{ color: accent }}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <div className="min-w-0">
                                <p
                                  className={cn(
                                    'text-[13.5px] font-medium truncate transition-colors',
                                    active ? 'text-[#AEC6FF]' : 'text-white',
                                  )}
                                >
                                  {s.title}
                                </p>
                                <p className="text-[11.5px] text-[#8A94A8] truncate">
                                  {s.category}
                                  {s.teacher_name ? ` · ${s.teacher_name}` : ''}
                                  {s.duration_hours > 0 ? ` · ${s.duration_hours}h` : ''}
                                </p>
                              </div>
                            </div>

                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-mono shrink-0 transition-opacity',
                                active
                                  ? 'text-[#AEC6FF] opacity-100'
                                  : 'text-[#7F97C7] opacity-0 group-hover:opacity-100',
                              )}
                            >
                              Open <ArrowRight className="h-3 w-3" />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Disciplines */}
                {filteredDisciplines.length > 0 && (
                  <div>
                    <p className="px-2.5 pb-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#7F97C7]">
                      Disciplines
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-1.5">
                      {filteredDisciplines.map((d) => {
                        const uid = `discipline:${d.value}`
                        const idx = entryIndexByUid.get(uid) ?? -1
                        const active = idx === clampedActiveIndex

                        return (
                          <button
                            id={`cmd-item-${uid}`}
                            key={d.value}
                            type="button"
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() =>
                              navigate(`/sessions?category=${encodeURIComponent(d.value)}`)
                            }
                            className={cn(
                              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                              active
                                ? 'bg-[#162038] text-white ring-1 ring-[#3B82F6]/50'
                                : 'bg-[#121A2E]/90 text-[#DDE3EC] hover:bg-[#162038] hover:text-white',
                            )}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: d.accent }}
                            />
                            <span>{d.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Educators */}
                {filteredTeachers.length > 0 && (
                  <div>
                    <p className="px-2.5 pb-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#7F97C7]">
                      Educators
                    </p>
                    <div className="grid sm:grid-cols-2 gap-1">
                      {filteredTeachers.map((t) => {
                        const uid = `teacher:${t.id}`
                        const idx = entryIndexByUid.get(uid) ?? -1
                        const active = idx === clampedActiveIndex

                        return (
                          <button
                            id={`cmd-item-${uid}`}
                            key={t.id}
                            type="button"
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => navigate(`/teachers/${t.id}`)}
                            className={cn(
                              'group flex items-center justify-between gap-2.5 rounded-2xl px-3 py-2 text-left transition-colors',
                              active ? 'bg-[#162038]' : 'hover:bg-[#121A2E]/85',
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B2A55] text-[11px] font-bold text-[#AEC6FF]">
                                {getInitials(t.full_name)}
                              </span>
                              <div className="min-w-0">
                                <p
                                  className={cn(
                                    'text-xs font-medium truncate',
                                    active ? 'text-[#AEC6FF]' : 'text-white',
                                  )}
                                >
                                  {t.full_name}
                                </p>
                                <p className="text-[11px] text-[#8A94A8] truncate">
                                  {t.field ?? 'Instructor'}
                                </p>
                              </div>
                            </div>
                            <ArrowRight
                              className={cn(
                                'h-3.5 w-3.5 shrink-0 text-[#7F97C7] transition-opacity',
                                active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                              )}
                            />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Keyboard Hint Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DDE3EC]/8 bg-[#080E1D]/90 px-4 py-2.5 text-[11px] text-[#8A94A8]">
                <div className="flex items-center gap-3.5 font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="rounded-md bg-[#121A2E] px-1.5 py-0.5 text-[10px] text-[#DDE3EC]">
                      ↑↓
                    </kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="rounded-md bg-[#121A2E] px-1.5 py-0.5 text-[10px] text-[#DDE3EC]">
                      ↵
                    </kbd>
                    <span>Open</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="rounded-md bg-[#121A2E] px-1.5 py-0.5 text-[10px] text-[#DDE3EC]">
                      Esc
                    </kbd>
                    <span>Close</span>
                  </span>
                </div>
                <span className="font-mono text-[10.5px] text-[#7F97C7]">
                  {commandEntries.length} results
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  )
}
