import { cn } from '@/lib/utils'

export function LoadingSpinner({ className }: { readonly className?: string }) {
  return (
    <div className={cn('flex items-center justify-center min-h-[200px]', className)}>
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
      </div>
    </div>
  )
}
