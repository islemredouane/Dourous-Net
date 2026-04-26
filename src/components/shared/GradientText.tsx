import { cn } from '@/lib/utils'

interface GradientTextProps {
  readonly children: React.ReactNode
  readonly className?: string
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </span>
  )
}
