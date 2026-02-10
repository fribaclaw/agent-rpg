import { useRef } from 'react'
import { Sky, Text, Grid } from '@react-three/drei'
import * as THREE from 'three'

const zones = [
  { name: 'Soul Chamber', color: '#a855f7' },
  { name: 'Memory Hall', color: '#3b82f6' },
  { name: 'Comms Tower', color: '#22d3ee' },
  { name: 'Skill Forge', color: '#f97316' },
  { name: 'Workshop', color: '#22c55e' },
]

function ZoneMarker({ name, color, position }: { name: string; color: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <group position={position}>
      {/* Pedestal base */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 0.3, 32]} />
        <meshStandardMaterial color="#1e1e2e" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Glowing pillar */}
      <mesh ref={meshRef} position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 2, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          toneMapped={false}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Glow sphere on top */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          toneMapped={false}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Floating label */}
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {name}
      </Text>
    </group>
  )
}

export default function World() {
  const radius = 8

  return (
    <>
      {/* Sky */}
      <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Grid overlay */}
      <Grid
        position={[0, 0.01, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#2a2a4a"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3a3a6a"
        fadeDistance={40}
        infiniteGrid
      />

      {/* Zone markers in a circle */}
      {zones.map((zone, i) => {
        const angle = (i / zones.length) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return <ZoneMarker key={zone.name} name={zone.name} color={zone.color} position={[x, 0, z]} />
      })}
    </>
  )
}
