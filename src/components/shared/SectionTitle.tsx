import { cn } from '@/lib/utils'
import { GradientText } from './GradientText'

interface SectionTitleProps {
  readonly eyebrow?: string
  readonly title: React.ReactNode
  readonly subtitle?: string
  readonly center?: boolean
  readonly className?: string
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = true,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('mb-16', center && 'text-center', className)}>
      {eyebrow && (
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
          {eyebrow}
        </p>
      )}
      <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-lg text-slate-400',
            center && 'mx-auto max-w-2xl',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

export { GradientText }
