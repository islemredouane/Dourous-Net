import type { Category } from '@/types'

export const SITE_CONFIG = {
  name: 'Dourous-Net',
  tagline: "Algeria's Digital Academy",
  description:
    'Expert-led sessions for the next generation of Algerian learners. Learn anytime, anywhere.',
  url: 'https://dourous-net.vercel.app',
}

export const CATEGORIES: { label: string; value: Category | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Mathematics', value: 'Mathematics' },
  { label: 'Physics', value: 'Physics' },
  { label: 'Chemistry', value: 'Chemistry' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'Languages', value: 'Languages' },
  { label: 'History', value: 'History' },
  { label: 'Arts', value: 'Arts' },
  { label: 'General', value: 'General' },
  { label: 'Other', value: 'Other' },
]

export const CATEGORY_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Physics: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Chemistry: 'bg-green-500/20 text-green-400 border-green-500/30',
  'Computer Science': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Languages: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  History: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Arts: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  General: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Other: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

export const CATEGORY_GRADIENTS: Record<string, string> = {
  Mathematics: 'bg-gradient-to-br from-blue-600/30 to-cyan-600/20',
  Physics: 'bg-gradient-to-br from-purple-600/30 to-indigo-600/20',
  Chemistry: 'bg-gradient-to-br from-emerald-600/30 to-teal-600/20',
  'Computer Science': 'bg-gradient-to-br from-indigo-600/30 to-violet-600/20',
  Languages: 'bg-gradient-to-br from-amber-600/30 to-orange-600/20',
  History: 'bg-gradient-to-br from-orange-600/30 to-red-600/20',
  Arts: 'bg-gradient-to-br from-pink-600/30 to-rose-600/20',
  General: 'bg-gradient-to-br from-slate-600/30 to-slate-500/20',
  Other: 'bg-gradient-to-br from-cyan-600/30 to-sky-600/20',
}

export const NAV_LINKS = [
  { label: 'Sessions', href: '/sessions' },
  { label: 'Dashboard', href: '/dashboard' },
]

export const LEVEL_COLORS = {
  Beginner: 'text-green-400',
  Intermediate: 'text-yellow-400',
  Advanced: 'text-red-400',
}
