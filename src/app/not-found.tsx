import Link from 'next/link'
import { GradientText } from '@/components/shared/GradientText'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10">
        <BookOpen className="h-9 w-9 text-indigo-400" />
      </div>
      <p className="mb-2 text-6xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
        <GradientText>404</GradientText>
      </p>
      <h1 className="mb-3 text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
        Page introuvable
      </h1>
      <p className="mb-8 max-w-sm text-slate-500">
        Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil.
      </p>
      <Link href="/">
        <Button className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-glow-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l&apos;accueil
        </Button>
      </Link>
    </div>
  )
}
