'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const emptySubscribe = () => () => {}

export interface CustomSelectOption {
  readonly value: string
  readonly label: string
  readonly hint?: string
}

interface CustomSelectProps {
  readonly id?: string
  readonly value: string
  readonly options: readonly CustomSelectOption[]
  readonly onChange: (value: string) => void
  readonly placeholder?: string
  readonly ariaLabel?: string
  readonly icon?: React.ReactNode
  readonly className?: string
  readonly triggerClassName?: string
  readonly menuClassName?: string
  readonly align?: 'left' | 'right'
}

interface MenuPosition {
  readonly top?: number
  readonly bottom?: number
  readonly left?: number
  readonly right?: number
  readonly minWidth: number
  readonly flipUp: boolean
}

export function CustomSelect({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  ariaLabel,
  icon,
  className,
  triggerClassName,
  menuClassName,
  align = 'left',
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<MenuPosition | null>(null)
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const prefersReduced = useReducedMotion()

  const selected = options.find((opt) => opt.value === value)

  const computePosition = useCallback((): MenuPosition | null => {
    const el = triggerRef.current
    if (!el || typeof window === 'undefined') return null
    const rect = el.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const flipUp = spaceBelow < 240 && spaceAbove > spaceBelow

    return {
      top: flipUp ? undefined : rect.bottom + 8,
      bottom: flipUp ? window.innerHeight - rect.top + 8 : undefined,
      left: align === 'left' ? rect.left : undefined,
      right: align === 'right' ? window.innerWidth - rect.right : undefined,
      minWidth: rect.width,
      flipUp,
    }
  }, [align])

  const handleToggle = () => {
    if (open) {
      setOpen(false)
      return
    }
    const nextPos = computePosition()
    setPos(nextPos)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      const next = computePosition()
      if (next) setPos(next)
    }

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, computePosition])

  const portalMenu = isClient
    ? createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                ref={menuRef}
                initial={
                  prefersReduced
                    ? false
                    : { opacity: 0, y: pos.flipUp ? 4 : -4, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: pos.flipUp ? 4 : -4, scale: 0.98 }
                }
                transition={{ duration: 0.14, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: pos.top,
                  bottom: pos.bottom,
                  left: pos.left,
                  right: pos.right,
                  minWidth: pos.minWidth,
                }}
                className={cn(
                  'z-[95] w-max max-w-[min(92vw,340px)] overflow-hidden rounded-2xl border border-[#DDE3EC]/15 bg-[#0E1526] py-3 pl-2 pr-2 shadow-2xl',
                  menuClassName,
                )}
              >
                <ul
                  id={listId}
                  role="listbox"
                  className="max-h-60 overflow-y-auto pr-1.5 space-y-1.5"
                >
                  {options.map((opt) => {
                    const isSelected = opt.value === value
                    return (
                      <li key={opt.value} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          onClick={() => {
                            onChange(opt.value)
                            setOpen(false)
                          }}
                          className={cn(
                            'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition-colors',
                            isSelected
                              ? 'bg-[#2563EB]/20 text-white font-semibold'
                              : 'text-[#DDE3EC]/85 hover:bg-[#162038] hover:text-white',
                          )}
                        >
                          <span className="min-w-0">
                            <span className="block truncate">{opt.label}</span>
                            {opt.hint && (
                              <span className="block text-[10.5px] font-normal text-[#8A94A8] truncate mt-0.5">
                                {opt.hint}
                              </span>
                            )}
                          </span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-[#60A5FA]" />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={handleToggle}
        className={cn(
          'flex w-full items-center justify-between gap-2.5 rounded-xl border border-[#DDE3EC]/15 bg-[#080E1D] px-3.5 text-left text-sm text-[#DDE3EC] transition-colors hover:border-[#DDE3EC]/35 focus:border-[#3B82F6] focus:outline-none',
          open && 'border-[#3B82F6] ring-2 ring-[#2563EB]/25',
          triggerClassName,
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          {icon && <span className="shrink-0 text-[#7F97C7]">{icon}</span>}
          <span className={cn('truncate', !selected && 'text-[#8A94A8]')}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-[#7F97C7] transition-transform duration-200',
            open && 'rotate-180 text-[#AEC6FF]',
          )}
        />
      </button>

      {portalMenu}
    </div>
  )
}
