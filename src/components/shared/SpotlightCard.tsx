'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly tone?: 'dark' | 'light'
  readonly spotlightColor?: string
  readonly onClick?: () => void
}

export function SpotlightCard({
  children,
  className,
  tone = 'dark',
  spotlightColor,
  onClick,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const defaultGlow =
    tone === 'light'
      ? 'rgba(37, 99, 235, 0.06)'
      : 'rgba(59, 130, 246, 0.14)'

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        'relative overflow-hidden rounded-2xl transition-colors duration-200',
        tone === 'light'
          ? 'bg-white border border-[#1B2A55]/10 hover:border-[#2563EB]/35'
          : 'bg-[#121A2E] border border-[#DDE3EC]/10 hover:border-[#3B82F6]/40 hover:bg-[#162038]',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, ${spotlightColor ?? defaultGlow}, transparent 75%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
