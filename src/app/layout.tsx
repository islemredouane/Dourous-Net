import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono, Lora } from 'next/font/google'
import { CommandPaletteProvider } from '@/components/layout/CommandPalette'
import { FloatingScrollbar } from '@/components/layout/FloatingScrollbar'
import { PwaProvider } from '@/components/pwa/PwaProvider'
import { Toaster } from '@/components/ui/sonner'
import { SITE_CONFIG } from '@/lib/constants'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic'],
  variable: '--font-lora',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0B1120',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  applicationName: SITE_CONFIG.name,
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['Algeria', 'education', 'online learning', 'sessions', 'courses', 'ESTIN', 'ISI'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: SITE_CONFIG.name,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${lora.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#0B1120] text-[#DDE3EC] antialiased selection:bg-[#2563EB] selection:text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[120] focus:px-4 focus:py-2 focus:bg-[#2563EB] focus:text-white focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <PwaProvider>
          <CommandPaletteProvider>
            {children}
            <FloatingScrollbar />
            <Toaster theme="dark" />
          </CommandPaletteProvider>
        </PwaProvider>
      </body>
    </html>
  )
}
