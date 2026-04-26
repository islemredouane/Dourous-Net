import dynamic from 'next/dynamic'

const HeroSceneInner = dynamic(() => import('./HeroSceneInner'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
})

export function HeroScene() {
  return <HeroSceneInner />
}
