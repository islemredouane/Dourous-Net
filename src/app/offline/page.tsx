import type { Metadata } from 'next'
import { WifiOff } from 'lucide-react'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { OfflineActions } from '@/components/pwa/OfflineActions'

export const metadata: Metadata = {
  title: 'Offline',
  description: 'You are currently offline. Reconnect to access Dourous-Net.',
}

export default function OfflinePage() {
  return (
    <main
      id="main"
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#0B1120] px-5 py-16 text-center"
    >
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-md rounded-3xl border border-[#DDE3EC]/12 bg-[#121A2E] p-8 sm:p-10 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <BrandLogo size={32} href="/" />
        </div>

        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3B82F6]/30 bg-[#2563EB]/15 text-[#AEC6FF]">
          <WifiOff className="h-6 w-6" />
        </div>

        <p className="eyebrow text-[#7F97C7] mb-2">Connection Paused</p>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          You&apos;re currently offline
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
          Your network connection dropped before this page could load. Check your Wi-Fi or mobile data and try again.
        </p>

        <OfflineActions />
      </div>
    </main>
  )
}
