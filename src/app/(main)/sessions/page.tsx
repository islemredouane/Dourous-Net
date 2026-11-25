import { Suspense } from 'react'
import { SessionsCatalogClient } from '@/components/sessions/SessionsCatalogClient'
import { SessionGridSkeleton } from '@/components/sessions/SessionGridSkeleton'

export const metadata = {
  title: 'Browse Sessions',
  description:
    'Explore structured video courses, interactive quizzes, and learning tracks across Computer Science, Mathematics, Physics, Languages, and more.',
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
