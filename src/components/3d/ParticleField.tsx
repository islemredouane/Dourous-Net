'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  readonly count?: number
}

function seededUnit(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123
  return x - Math.floor(x)
}

export function ParticleField({ count = 750 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const palette = [
      new THREE.Color('#2563EB'), // Cobalt
      new THREE.Color('#60A5FA'), // Sky Blue
      new THREE.Color('#AEC6FF'), // Periwinkle
      new THREE.Color('#10B981'), // Emerald
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (seededUnit(i * 4 + 1) - 0.5) * 20
      positions[i3 + 1] = (seededUnit(i * 4 + 2) - 0.5) * 12
      positions[i3 + 2] = (seededUnit(i * 4 + 3) - 0.5) * 10

      const color = palette[Math.floor(seededUnit(i * 4 + 4) * palette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.008
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  )
}
