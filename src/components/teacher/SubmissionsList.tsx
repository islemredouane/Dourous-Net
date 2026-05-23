'use client'

import { ExternalLink, FileText, Inbox } from 'lucide-react'
import { motion } from 'framer-motion'

interface Submission {
  id: string
  submission_url: string
  updated_at: string
  student: { id: string; full_name: string; email: string } | null
  session: { id: string; title: string } | null
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function initials(name: string | null | undefined) {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

const AVATAR_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-blue-600',
  'from-orange-500 to-amber-600',
  'from-violet-500 to-purple-600',
]

export function SubmissionsList({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-20 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 shadow-glow-sm">
          <Inbox className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}>No submissions yet</p>
        <p className="text-sm text-slate-400 max-w-sm">Students who upload assignments for your sessions will appear here.</p>
      </motion.div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.05]">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Student</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Session</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Submitted</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">File</p>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.04]">
        {submissions.map((sub, i) => {
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
          const fileName = sub.submission_url.split('/').pop()?.split('?')[0] ?? 'assignment'

          return (
            <div
              key={sub.id}
              className="flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4 hover:bg-white/[0.02] transition-colors"
            >
              {/* Student */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-[11px] font-bold text-white`}>
                  {initials(sub.student?.full_name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {sub.student?.full_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{sub.student?.email}</p>
                </div>
              </div>

              {/* Session */}
              <div className="min-w-0 sm:block">
                <span className="inline-flex items-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400 truncate max-w-full">
                  {sub.session?.title ?? 'Unknown session'}
                </span>
              </div>

              {/* Time */}
              <p className="text-xs text-slate-400 whitespace-nowrap">
                {timeAgo(sub.updated_at)}
              </p>

              {/* Open PDF */}
              <a
                href={sub.submission_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors whitespace-nowrap"
              >
                <FileText className="h-3.5 w-3.5" />
                Open PDF
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
