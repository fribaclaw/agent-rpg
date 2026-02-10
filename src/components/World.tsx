import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid, Sky } from '@react-three/drei'
import * as THREE from 'three'

export const ZONE_POSITIONS: Record<string, [number, number, number]> = {
  'Soul Chamber': [0, 0, -8],
  'Memory Hall': [8, 0, -4],
  'Comms Tower': [-8, 0, -4],
  'Skill Forge': [6, 0, 6],
  'Workshop': [-6, 0, 6],
}

const ZONE_COLORS: Record<string, string> = {
  'Soul Chamber': '#a855f7',
  'Memory Hall': '#3b82f6',
  'Comms Tower': '#22c55e',
  'Skill Forge': '#f59e0b',
  'Workshop': '#ef4444',
}

function ZoneMarker({ name }: { name: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.PointLight>(null!)
  const pos = ZONE_POSITIONS[name]
  const color = ZONE_COLORS[name]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.y = 1.2 + Math.sin(t * 2) * 0.15
      ref.current.rotation.y = t * 0.5
    }
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(t * 3) * 0.8
    }
  })

  return (
    <group position={pos}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.5, 8]} />
        <meshStandardMaterial color="#2a1a4e" />
      </mesh>
      <mesh ref={ref} position={[0, 1.2, 0]} castShadow>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 1.5, 0]} color={color} intensity={2} distance={8} />
    </group>
  )
}

export function World() {
  return (
    <>
      <Sky sunPosition={[50, 30, -50]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <Grid
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#334"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#446"
        fadeDistance={50}
        position={[0, 0.01, 0]}
      />

      {Object.keys(ZONE_POSITIONS).map((name) => (
        <ZoneMarker key={name} name={name} />
      ))}
    </>
  )
}
