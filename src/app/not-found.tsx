import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1120] px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#DDE3EC]/15 bg-[#121A2E]">
        <BookOpen className="h-7 w-7 text-[#60A5FA]" />
      </div>
      <p
        className="mb-2 text-6xl font-bold tabular-nums text-[#AEC6FF]"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        404
      </p>
      <h1
        className="mb-3 text-2xl font-bold text-white"
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-sm text-[#94A3B8] leading-relaxed">
        The page or course route you requested does not exist or has been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-11 rounded-full px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/sessions"
          className="inline-flex items-center h-11 rounded-full px-6 border border-[#DDE3EC]/20 text-sm font-medium text-[#DDE3EC] hover:border-white hover:text-white transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    </div>
  )
}
