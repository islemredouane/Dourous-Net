'use client'

import Link from 'next/link'
import { RefreshCw, Home } from 'lucide-react'

export function OfflineActions() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] px-6 text-sm font-semibold text-white transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try Reconnecting</span>
      </button>

      <Link
        href="/"
        className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#DDE3EC]/20 bg-[#121A2E] hover:border-[#AEC6FF] px-6 text-sm font-medium text-[#DDE3EC] hover:text-white transition-colors"
      >
        <Home className="h-4 w-4 text-[#AEC6FF]" />
        <span>Back Home</span>
      </Link>
    </div>
  )
}
