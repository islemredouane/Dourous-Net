import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SessionsCatalogClient } from '@/components/sessions/SessionsCatalogClient'
import { SessionGridSkeleton } from '@/components/sessions/SessionGridSkeleton'
import { SITE_CONFIG } from '@/lib/constants'

const PAGE_TITLE = 'Browse Sessions'
const PAGE_DESC =
  'Explore structured video courses, interactive quizzes, and learning tracks across Computer Science, Mathematics, Physics, Languages, and more.'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: '/sessions' },
  openGraph: {
    type: 'website',
    url: '/sessions',
    title: `${PAGE_TITLE} · ${SITE_CONFIG.name}`,
    description: PAGE_DESC,
    images: [
      {
        url: '/og/sessions.jpg',
        width: 1200,
        height: 630,
        alt: `${PAGE_TITLE} — ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PAGE_TITLE} · ${SITE_CONFIG.name}`,
    description: PAGE_DESC,
    images: ['/og/sessions.jpg'],
  },
}

export default function SessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1120] pt-36 pb-16">
          <div className="mx-auto max-w-[1240px] px-5 md:px-10">
            <SessionGridSkeleton />
          </div>
        </div>
      }
    >
      <SessionsCatalogClient />
    </Suspense>
  )
}
