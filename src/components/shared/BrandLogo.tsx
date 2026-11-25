import Link from 'next/link'
import { LogoIcon } from './LogoIcon'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  size?: number
  showSubtitle?: boolean
  tone?: 'dark' | 'light'
  href?: string
  className?: string
  onClick?: () => void
}

export function BrandLogo({
  size = 34,
  showSubtitle = true,
  tone = 'dark',
  href = '/',
  className,
  onClick,
}: BrandLogoProps) {
  const isLight = tone === 'light'

  const content = (
    <span className={cn('inline-flex items-center gap-3 group shrink-0', className)}>
      <span className="transition-transform duration-300 group-hover:scale-105 logo-glow">
        <LogoIcon size={size} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[18px] font-bold tracking-tight',
            isLight ? 'text-[#0B1120]' : 'text-white',
          )}
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Dourous<span className="text-[#3B82F6]">-Net</span>
        </span>
        {showSubtitle && (
          <span
            className={cn(
              'hidden sm:block mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em]',
              isLight ? 'text-slate-500' : 'text-[#8A94A8]',
            )}
          >
            Algeria&apos;s Digital Academy
          </span>
        )}
      </span>
    </span>
  )

  if (!href) return content

  return (
    <Link href={href} onClick={onClick} aria-label="Dourous-Net — Home">
      {content}
    </Link>
  )
}
