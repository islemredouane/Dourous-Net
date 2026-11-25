'use client'

import { ExternalLink, FileText, Inbox } from 'lucide-react'

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
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function SubmissionsList({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] py-16 px-4 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D]">
          <Inbox className="h-5 w-5 text-[#7F97C7]" />
        </div>
        <p
          className="text-base font-bold text-white mb-1"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          No submissions yet
        </p>
        <p className="text-xs text-[#94A3B8] max-w-sm">
          Student homework PDFs uploaded for your sessions will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#DDE3EC]/12 bg-[#121A2E] overflow-hidden">
      <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-[#DDE3EC]/10 bg-[#0E1526]">
        <p className="eyebrow text-[#8A94A8]">Student</p>
        <p className="eyebrow text-[#8A94A8]">Session</p>
        <p className="eyebrow text-[#8A94A8]">Submitted</p>
        <p className="eyebrow text-[#8A94A8]">File</p>
      </div>

      <div className="divide-y divide-[#DDE3EC]/8">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4 hover:bg-[#162038] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B2A55] border border-[#3B82F6]/30 text-[11px] font-bold text-[#AEC6FF]">
                {initials(sub.student?.full_name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {sub.student?.full_name ?? 'Unknown'}
                </p>
                <p className="font-mono text-[11px] text-[#8A94A8] truncate">
                  {sub.student?.email}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <span className="inline-flex items-center rounded-lg border border-[#3B82F6]/25 bg-[#2563EB]/15 px-2.5 py-1 text-xs font-medium text-[#AEC6FF] truncate max-w-full">
                {sub.session?.title ?? 'Unknown session'}
              </span>
            </div>

            <p className="font-mono text-xs text-[#8A94A8] whitespace-nowrap">
              {timeAgo(sub.updated_at)}
            </p>

            <a
              href={sub.submission_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#DDE3EC]/15 bg-[#080E1D] px-4 text-[13px] font-medium text-[#DDE3EC] hover:border-[#3B82F6] hover:text-white transition-colors whitespace-nowrap"
            >
              <FileText className="h-3.5 w-3.5 text-[#60A5FA]" />
              <span>Open PDF</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
