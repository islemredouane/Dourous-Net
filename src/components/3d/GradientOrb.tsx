'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

interface GradientOrbProps {
  readonly position?: [number, number, number]
  readonly color?: string
  readonly size?: number
  readonly speed?: number
}

export function GradientOrb({
  position = [3, -2, -4],
  color = '#6366f1',
  size = 2.5,
  speed = 0.4,
}: GradientOrbProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.04} />
    </mesh>
  )
}
