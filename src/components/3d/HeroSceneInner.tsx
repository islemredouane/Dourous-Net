'use client'

import { Canvas } from '@react-three/fiber'
import { FloatingGeometry } from './FloatingGeometry'
import { ParticleField } from './ParticleField'
import { GradientOrb } from './GradientOrb'

export default function HeroSceneInner() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 58 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} color="#3B82F6" intensity={2.5} />
      <pointLight position={[-5, -5, -3]} color="#7F97C7" intensity={1.8} />
      <pointLight position={[0, 3, 2]} color="#10B981" intensity={1.2} />

      <FloatingGeometry />
      <ParticleField count={750} />
      <GradientOrb position={[3, -2, -4]} color="#2563EB" size={2.8} />
      <GradientOrb position={[-4, 2, -5]} color="#10B981" size={2.2} speed={0.3} />
    </Canvas>
  )
}
