import { DISCIPLINES } from '@/lib/constants'
import {
  Atom,
  BookOpen,
  Code2,
  FlaskConical,
  Landmark,
  Languages,
  Sigma,
  type LucideIcon,
} from 'lucide-react'

const DISCIPLINE_ICONS: Record<string, LucideIcon> = {
  'Computer Science': Code2,
  Mathematics: Sigma,
  Physics: Atom,
  Chemistry: FlaskConical,
  Languages: Languages,
  History: Landmark,
}

const DISCIPLINE_ACCENTS = new Map<string, string>(
  DISCIPLINES.map((d) => [d.value, d.accent]),
)

export function getDisciplineIcon(
  category: string,
  fallback: LucideIcon = BookOpen,
): LucideIcon {
  return DISCIPLINE_ICONS[category] ?? fallback
}

export function getDisciplineAccent(category: string, fallback = '#3B82F6'): string {
  return DISCIPLINE_ACCENTS.get(category) ?? fallback
}
