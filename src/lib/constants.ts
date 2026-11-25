import type { Category } from '@/types'

export const SITE_CONFIG = {
  name: 'Dourous-Net',
  shortTag: 'DZ ACADEMY',
  tagline: "Algeria's Digital Academy",
  quote: 'Education moves forward when knowledge is structured, open, and guided.',
  description:
    'Expert-led video sessions, instant-graded quizzes, assignment submissions, and an AI Learning Coach for Algerian students and educators.',
  url: 'https://dourous-net-six.vercel.app',
  email: 'contact@dourous-net.dz',
  githubUrl: 'https://github.com/islemredouane/Dourous-Net',
  country: 'Algeria · 69 Wilayas',
  institution: 'ISI 2CP · Education Cloud Architecture',
} as const

export interface DisciplineInfo {
  label: string
  value: Category
  code: string
  tagline: string
  description: string
  topics: string[]
  accent: string
}

export const DISCIPLINES: DisciplineInfo[] = [
  {
    label: 'Computer Science',
    value: 'Computer Science',
    code: '01',
    tagline: 'Algorithms, Systems & Modern Web',
    description:
      'From foundational data structures and complexity analysis to full-stack Next.js architectures, SQL modeling, and cloud engineering.',
    topics: ['Algorithms & Big-O', 'React & Next.js', 'PostgreSQL & RLS', 'Data Structures'],
    accent: '#3B82F6',
  },
  {
    label: 'Mathematics',
    value: 'Mathematics',
    code: '02',
    tagline: 'Linear Algebra, Calculus & Probability',
    description:
      'Rigorous engineering mathematics covering vector spaces, integral calculus, differential equations, and applied statistics.',
    topics: ['Linear Algebra', 'Integral Calculus', 'Probability Laws', 'Hypothesis Testing'],
    accent: '#60A5FA',
  },
  {
    label: 'Physics',
    value: 'Physics',
    code: '03',
    tagline: 'Mechanics, Waves & Quantum Foundations',
    description:
      'Clear conceptual and analytical physics linking classical laws to quantum mechanics, semiconductors, and modern instrumentation.',
    topics: ['Quantum Mechanics', 'Wave Duality', 'Schrödinger Equation', 'Applied Optics'],
    accent: '#38BDF8',
  },
  {
    label: 'Chemistry',
    value: 'Chemistry',
    code: '04',
    tagline: 'Organic Mechanisms & Analytical Lab',
    description:
      'Structured reaction mechanisms, stereochemistry, thermodynamics, and exam-grade problem solving across national curricula.',
    topics: ['Organic Reactions', 'Stereochemistry', 'SN1 / SN2 & E1 / E2', 'Aromatic Systems'],
    accent: '#10B981',
  },
  {
    label: 'Languages',
    value: 'Languages',
    code: '05',
    tagline: 'Technical English, French & Academic Writing',
    description:
      'Master scientific communication, technical reporting, conference speaking, and international exam readiness for STEM careers.',
    topics: ['Technical English', 'Scientific Writing', 'TOEFL / IELTS Prep', 'Oral Fluency'],
    accent: '#F59E0B',
  },
  {
    label: 'History',
    value: 'History',
    code: '06',
    tagline: 'Contemporary Algeria & Critical Method',
    description:
      'Source-driven exploration of modern Algerian state-building, socio-economic milestones, and historical historiography.',
    topics: ['Post-1962 Algeria', 'Archive Analysis', 'Socio-Political History', 'Critical Essay'],
    accent: '#FB923C',
  },
]

export const CATEGORIES: { label: string; value: Category | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'Mathematics', value: 'Mathematics' },
  { label: 'Physics', value: 'Physics' },
  { label: 'Chemistry', value: 'Chemistry' },
  { label: 'Languages', value: 'Languages' },
  { label: 'History', value: 'History' },
  { label: 'Arts', value: 'Arts' },
  { label: 'General', value: 'General' },
  { label: 'Other', value: 'Other' },
]

export const CATEGORY_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  Physics: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
  Chemistry: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  'Computer Science': 'bg-[#2563EB]/20 text-[#AEC6FF] border-[#3B82F6]/30',
  Languages: 'bg-amber-500/15 text-amber-300 border-amber-400/25',
  History: 'bg-orange-500/15 text-orange-300 border-orange-400/25',
  Arts: 'bg-rose-500/15 text-rose-300 border-rose-400/25',
  General: 'bg-slate-500/15 text-slate-300 border-slate-400/25',
  Other: 'bg-teal-500/15 text-teal-300 border-teal-400/25',
}

export const CATEGORY_COLORS_LIGHT: Record<string, string> = {
  Mathematics: 'bg-blue-50 text-blue-700 border-blue-200',
  Physics: 'bg-sky-50 text-sky-700 border-sky-200',
  Chemistry: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Computer Science': 'bg-blue-50 text-[#1D4ED8] border-blue-200',
  Languages: 'bg-amber-50 text-amber-800 border-amber-200',
  History: 'bg-orange-50 text-orange-800 border-orange-200',
  Arts: 'bg-rose-50 text-rose-700 border-rose-200',
  General: 'bg-slate-100 text-slate-700 border-slate-200',
  Other: 'bg-teal-50 text-teal-700 border-teal-200',
}

export const CATEGORY_GRADIENTS: Record<string, string> = {
  Mathematics: 'bg-gradient-to-br from-[#1B2A55] via-[#121A2E] to-[#0B1120]',
  Physics: 'bg-gradient-to-br from-[#0F2942] via-[#121A2E] to-[#0B1120]',
  Chemistry: 'bg-gradient-to-br from-[#0B2E26] via-[#121A2E] to-[#0B1120]',
  'Computer Science': 'bg-gradient-to-br from-[#162C5B] via-[#121A2E] to-[#0B1120]',
  Languages: 'bg-gradient-to-br from-[#33240C] via-[#121A2E] to-[#0B1120]',
  History: 'bg-gradient-to-br from-[#341E12] via-[#121A2E] to-[#0B1120]',
  Arts: 'bg-gradient-to-br from-[#321524] via-[#121A2E] to-[#0B1120]',
  General: 'bg-gradient-to-br from-[#1A2236] via-[#121A2E] to-[#0B1120]',
  Other: 'bg-gradient-to-br from-[#112A36] via-[#121A2E] to-[#0B1120]',
}

export const NAV_LINKS = [
  { label: 'Sessions', href: '/sessions' },
  { label: 'Teachers', href: '/teachers' },
  { label: 'About', href: '/about' },
  { label: 'Dashboard', href: '/dashboard', authOnly: true },
] as const

export const LEVEL_COLORS = {
  Beginner: 'text-emerald-400',
  Intermediate: 'text-amber-400',
  Advanced: 'text-sky-400',
} as const
