import { cn } from '@/lib/utils'

interface SectionTitleProps {
  readonly eyebrow?: string
  readonly title: React.ReactNode
  readonly subtitle?: string
  readonly center?: boolean
  readonly tone?: 'dark' | 'light'
  readonly className?: string
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = true,
  tone = 'dark',
  className,
}: SectionTitleProps) {
  const isLight = tone === 'light'

  return (
    <div className={cn('mb-12', center && 'text-center', className)}>
      {eyebrow && (
        <div
          className={cn(
            'mb-3 inline-flex items-center gap-3 eyebrow',
            isLight ? 'text-[#2563EB]' : 'text-[#7F97C7]',
          )}
        >
          <span>{eyebrow}</span>
          <span
            className={cn(
              'h-px w-8',
              isLight ? 'bg-[#2563EB]/35' : 'bg-[#7F97C7]/40',
            )}
          />
        </div>
      )}
      <h2
        className={cn(
          'mb-4 text-3xl font-bold tracking-tight md:text-5xl leading-[1.08]',
          isLight ? 'text-[#0B1120]' : 'text-white',
        )}
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-base md:text-lg leading-relaxed',
            isLight ? 'text-[#3A4458]' : 'text-[#94A3B8]',
            center && 'mx-auto max-w-2xl',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
