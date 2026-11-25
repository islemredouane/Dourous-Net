'use client'

import { Download } from 'lucide-react'
import { usePwaInstall } from '@/components/pwa/PwaProvider'
import { cn } from '@/lib/utils'

interface InstallAppButtonProps {
  readonly className?: string
  readonly label?: string
}

export function InstallAppButton({
  className,
  label = 'Install App',
}: InstallAppButtonProps) {
  const { canInstall, isIOS, isStandalone, promptInstall } = usePwaInstall()

  if (isStandalone || (!canInstall && !isIOS)) {
    return null
  }

  return (
    <button
      type="button"
      onClick={promptInstall}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#3B82F6]/35 bg-[#121A2E] px-4 text-xs font-medium text-[#AEC6FF] hover:border-[#3B82F6]/70 hover:bg-[#162038] hover:text-white transition-colors whitespace-nowrap',
        className,
      )}
    >
      <Download className="h-3.5 w-3.5 text-[#60A5FA] shrink-0" />
      <span>{label}</span>
    </button>
  )
}
