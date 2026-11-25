'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

export function FloatingGeometry() {
  const icosaRef = useRef<Mesh>(null)
  const torusRef = useRef<Mesh>(null)
  const octaRef = useRef<Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (icosaRef.current) {
      icosaRef.current.rotation.x = t * 0.12
      icosaRef.current.rotation.y = t * 0.16
      icosaRef.current.position.y = Math.sin(t * 0.45) * 0.25
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.22
      torusRef.current.rotation.z = t * 0.15
      torusRef.current.position.y = Math.sin(t * 0.38 + 1) * 0.35
    }

    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.2
      octaRef.current.rotation.z = t * 0.12
      octaRef.current.position.y = Math.sin(t * 0.5 + 2) * 0.2
    }
  })

  return (
    <>
      <mesh ref={icosaRef} position={[2.2, 0.2, -0.5]}>
        <icosahedronGeometry args={[1.25, 1]} />
        <MeshDistortMaterial
          color="#3B82F6"
          transparent
          opacity={0.14}
          wireframe
          distort={0.22}
          speed={1.6}
        />
      </mesh>

      <mesh ref={torusRef} position={[3.6, 0.8, -1.5]}>
        <torusKnotGeometry args={[0.45, 0.12, 96, 16]} />
        <meshStandardMaterial
          color="#60A5FA"
          transparent
          opacity={0.35}
          roughness={0.25}
          metalness={0.8}
          emissive="#2563EB"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh ref={octaRef} position={[-3.4, -0.6, -2]}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#10B981"
          transparent
          opacity={0.28}
          roughness={0.2}
          metalness={0.85}
          emissive="#10B981"
          emissiveIntensity={0.12}
        />
      </mesh>
    </>
  )
}
