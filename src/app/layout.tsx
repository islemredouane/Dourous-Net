import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Dourous-Net — Algeria's Digital Academy",
  description:
    'Expert-led sessions in Mathematics, Computer Science, Languages, and more. Learn at your own pace, track your progress, and submit assignments — all in one place.',
  keywords: ['Algeria', 'education', 'online learning', 'sessions', 'courses'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
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
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}
