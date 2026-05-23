'use client'

export function SessionGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col h-[380px] rounded-2xl border border-white/[0.08] bg-slate-900/40 p-5 overflow-hidden relative"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
          
          {/* Image skeleton */}
          <div className="h-40 w-full rounded-xl bg-slate-800/50 mb-4" />
          
          {/* Badge skeleton */}
          <div className="h-6 w-24 rounded-full bg-slate-800/50 mb-3" />
          
          {/* Title skeleton */}
          <div className="h-6 w-3/4 rounded-md bg-slate-800/50 mb-2" />
          <div className="h-6 w-1/2 rounded-md bg-slate-800/50 mb-4" />
          
          <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between">
            {/* Teacher skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-800/50" />
              <div className="h-4 w-20 rounded-md bg-slate-800/50" />
            </div>
            {/* Button skeleton */}
            <div className="h-8 w-16 rounded-lg bg-slate-800/50" />
          </div>
        </div>
      ))}
    </div>
  )
}
