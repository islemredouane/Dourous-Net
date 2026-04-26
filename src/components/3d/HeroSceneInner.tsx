'use client'

import { Canvas } from '@react-three/fiber'
import { FloatingGeometry } from './FloatingGeometry'
import { ParticleField } from './ParticleField'
import { GradientOrb } from './GradientOrb'

export default function HeroSceneInner() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} color="#6366f1" intensity={3} />
      <pointLight position={[-5, -5, -3]} color="#8b5cf6" intensity={2} />
      <pointLight position={[0, 3, 2]} color="#22d3ee" intensity={1.5} />

      <FloatingGeometry />
      <ParticleField count={1200} />
      <GradientOrb position={[3, -2, -4]} color="#6366f1" size={3} />
      <GradientOrb position={[-4, 2, -5]} color="#8b5cf6" size={2.5} speed={0.3} />
    </Canvas>
  )
}
