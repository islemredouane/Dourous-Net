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
      icosaRef.current.rotation.x = t * 0.15
      icosaRef.current.rotation.y = t * 0.2
      icosaRef.current.position.y = Math.sin(t * 0.5) * 0.3
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3
      torusRef.current.rotation.z = t * 0.2
      torusRef.current.position.y = Math.sin(t * 0.4 + 1) * 0.4
    }

    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.25
      octaRef.current.rotation.z = t * 0.15
      octaRef.current.position.y = Math.sin(t * 0.6 + 2) * 0.25
    }
  })

  return (
    <>
      {/* Main icosahedron — centre */}
      <mesh ref={icosaRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.2, 1]} />
        <MeshDistortMaterial
          color="#6366f1"
          transparent
          opacity={0.15}
          wireframe
          distort={0.3}
          speed={2}
        />
      </mesh>

      {/* Solid inner core */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#6366f1"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Torus knot — right */}
      <mesh ref={torusRef} position={[3.5, 0.5, -1]}>
        <torusKnotGeometry args={[0.5, 0.15, 100, 16]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.5}
          roughness={0.2}
          metalness={0.8}
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Octahedron — left */}
      <mesh ref={octaRef} position={[-3.2, -0.5, -1.5]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.9}
          emissive="#22d3ee"
          emissiveIntensity={0.15}
        />
      </mesh>
    </>
  )
}
