'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const MIN_THUMB_HEIGHT = 36
const MAX_THUMB_HEIGHT = 72
const EDGE_INSET = 6

export function FloatingScrollbar() {
  const pathname = usePathname()
  const barRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const bar = barRef.current
    const thumb = thumbRef.current
    if (!bar || !thumb) return

    root.classList.add('has-floating-scrollbar')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    let thumbHeight = MIN_THUMB_HEIGHT
    let rafId = 0

    const getMaxScroll = () =>
      Math.max(0, root.scrollHeight - window.innerHeight)

    const getTravel = () =>
      Math.max(0, window.innerHeight - EDGE_INSET * 2 - thumbHeight)

    const render = () => {
      rafId = 0
      const maxScroll = getMaxScroll()
      const scrollLocked =
        body.style.overflow === 'hidden' || root.style.overflow === 'hidden'
      const visible =
        finePointer.matches && maxScroll > 2 && !scrollLocked

      bar.hidden = !visible
      if (!visible) return

      const viewportH = window.innerHeight
      const scaledHeight = Math.round(
        (viewportH * viewportH) / Math.max(root.scrollHeight, 8500),
      )
      thumbHeight = Math.max(
        MIN_THUMB_HEIGHT,
        Math.min(MAX_THUMB_HEIGHT, scaledHeight),
      )

      const travel = getTravel()
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      const y = Math.round(progress * travel)

      thumb.style.height = `${thumbHeight}px`
      thumb.style.transform = `translate3d(0, ${y}px, 0)`
    }

    const scheduleRender = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(render)
      }
    }

    window.addEventListener('scroll', scheduleRender, { passive: true })
    window.addEventListener('resize', scheduleRender, { passive: true })
    finePointer.addEventListener('change', scheduleRender)

    const resizeObserver = new ResizeObserver(scheduleRender)
    resizeObserver.observe(body)

    const lockObserver = new MutationObserver(scheduleRender)
    lockObserver.observe(body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    lockObserver.observe(root, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    render()

    let startY = 0
    let startScrollY = 0

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      startY = e.clientY
      startScrollY = window.scrollY
      thumb.setPointerCapture(e.pointerId)
      bar.dataset.dragging = 'true'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!thumb.hasPointerCapture(e.pointerId)) return
      const travel = getTravel()
      if (travel <= 0) return
      const deltaY = e.clientY - startY
      const nextScroll = startScrollY + (deltaY / travel) * getMaxScroll()
      window.scrollTo({ top: nextScroll, behavior: 'instant' })
    }

    const stopDragging = (e: PointerEvent) => {
      if (thumb.hasPointerCapture(e.pointerId)) {
        thumb.releasePointerCapture(e.pointerId)
      }
      delete bar.dataset.dragging
    }

    thumb.addEventListener('pointerdown', onPointerDown)
    thumb.addEventListener('pointermove', onPointerMove)
    thumb.addEventListener('pointerup', stopDragging)
    thumb.addEventListener('pointercancel', stopDragging)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      root.classList.remove('has-floating-scrollbar')
      window.removeEventListener('scroll', scheduleRender)
      window.removeEventListener('resize', scheduleRender)
      finePointer.removeEventListener('change', scheduleRender)
      resizeObserver.disconnect()
      lockObserver.disconnect()
      thumb.removeEventListener('pointerdown', onPointerDown)
      thumb.removeEventListener('pointermove', onPointerMove)
      thumb.removeEventListener('pointerup', stopDragging)
      thumb.removeEventListener('pointercancel', stopDragging)
    }
  }, [pathname])

  return (
    <div
      ref={barRef}
      id="floating-scrollbar"
      hidden
      aria-hidden="true"
      className="group pointer-events-none fixed right-0 inset-y-[6px] z-[75] w-3.5 select-none bg-transparent"
    >
      <div
        ref={thumbRef}
        id="floating-scrollbar-thumb"
        className="group/thumb pointer-events-auto absolute top-0 right-0 w-3.5 cursor-grab touch-none will-change-transform active:cursor-grabbing"
      >
        <span className="block ml-auto mr-[3px] h-full w-[3px] rounded-full bg-[#3B82F6]/85 shadow-[0_0_8px_rgba(59,130,246,0.35)] transition-[width,background-color] duration-150 group-hover/thumb:w-[5px] group-hover/thumb:bg-[#2563EB] group-data-[dragging=true]:w-[5px] group-data-[dragging=true]:bg-[#2563EB]" />
      </div>
    </div>
  )
}
