'use client'

export function SessionGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col h-[370px] rounded-2xl border border-[#DDE3EC]/10 bg-[#121A2E] overflow-hidden relative"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_1.5s_infinite]" />
          <div className="aspect-[16/10] w-full bg-[#080E1D] border-b border-[#DDE3EC]/10" />
          <div className="p-5 flex-1 flex flex-col">
            <div className="h-5 w-24 rounded-md bg-[#080E1D] mb-3" />
            <div className="h-5 w-4/5 rounded-md bg-[#080E1D] mb-2" />
            <div className="h-4 w-3/5 rounded-md bg-[#080E1D] mb-4" />
            <div className="mt-auto pt-4 border-t border-[#DDE3EC]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-[#080E1D]" />
                <div className="h-3.5 w-24 rounded bg-[#080E1D]" />
              </div>
              <div className="h-3.5 w-12 rounded bg-[#080E1D]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
