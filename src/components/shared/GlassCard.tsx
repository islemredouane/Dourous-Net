import { cn } from '@/lib/utils'

interface GlassCardProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly glow?: boolean
  readonly hover?: boolean
  readonly onClick?: () => void
}

export function GlassCard({
  children,
  className,
  glow = false,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-2xl p-6',
        hover && 'transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.06]',
        glow && 'hover:shadow-glow-sm',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
