import { useRef, useMemo } from 'react'
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

/* ── Floating particle motes ── */
function FloatingMotes({ count = 120 }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60
      arr[i * 3 + 1] = Math.random() * 12 + 0.5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geo = ref.current.geometry
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += Math.sin(t * 0.4 + i) * 0.002
      // wrap vertically
      if ((pos.array[i * 3 + 1] as number) > 14) (pos.array as Float32Array)[i * 3 + 1] = 0.5
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#b4a0ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

/* ── Ambient rocks ── */
const ROCK_DATA = [
  { pos: [3, 0.2, 3] as [number, number, number], s: 0.4 },
  { pos: [-4, 0.15, 7] as [number, number, number], s: 0.3 },
  { pos: [9, 0.25, -8] as [number, number, number], s: 0.5 },
  { pos: [-10, 0.2, -6] as [number, number, number], s: 0.35 },
  { pos: [12, 0.18, 2] as [number, number, number], s: 0.28 },
  { pos: [-3, 0.22, -12] as [number, number, number], s: 0.45 },
  { pos: [7, 0.15, 10] as [number, number, number], s: 0.32 },
  { pos: [-11, 0.3, 3] as [number, number, number], s: 0.5 },
  { pos: [1, 0.12, 12] as [number, number, number], s: 0.25 },
  { pos: [-7, 0.2, -10] as [number, number, number], s: 0.38 },
]

function Rocks() {
  return (
    <>
      {ROCK_DATA.map((r, i) => (
        <mesh key={i} position={r.pos} castShadow receiveShadow rotation={[0, i * 1.3, 0]}>
          <dodecahedronGeometry args={[r.s, 0]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}

/* ── Small stone pillars ── */
const PILLAR_DATA = [
  { pos: [5, 0.5, -6] as [number, number, number], h: 1.0 },
  { pos: [-5, 0.7, -9] as [number, number, number], h: 1.4 },
  { pos: [11, 0.4, 5] as [number, number, number], h: 0.8 },
  { pos: [-9, 0.6, 8] as [number, number, number], h: 1.2 },
]

function Pillars() {
  return (
    <>
      {PILLAR_DATA.map((p, i) => (
        <mesh key={i} position={p.pos} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.2, p.h, 6]} />
          <meshStandardMaterial color="#1e1e30" roughness={0.85} />
        </mesh>
      ))}
    </>
  )
}

/* ── Zone marker with ground ring ── */
function ZoneMarker({ name }: { name: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.PointLight>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  const pos = ZONE_POSITIONS[name]
  const color = ZONE_COLORS[name]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.y = 1.4 + Math.sin(t * 2) * 0.2
      ref.current.rotation.y = t * 0.8
      ref.current.rotation.x = Math.sin(t * 1.2) * 0.15
      // pulse scale
      const pulse = 1 + Math.sin(t * 3) * 0.08
      ref.current.scale.setScalar(pulse)
    }
    if (glowRef.current) {
      glowRef.current.intensity = 3 + Math.sin(t * 3) * 1.2
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3
      const ringMat = ringRef.current.material as THREE.MeshStandardMaterial
      ringMat.opacity = 0.3 + Math.sin(t * 2.5) * 0.15
    }
  })

  return (
    <group position={pos}>
      {/* pedestal */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1, 0.5, 8]} />
        <meshStandardMaterial color="#2a1a4e" roughness={0.7} />
      </mesh>

      {/* ground light ring */}
      <mesh ref={ringRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.6, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* crystal */}
      <mesh ref={ref} position={[0, 1.4, 0]} castShadow>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* small orbiting shard */}
      <mesh position={[0, 1.4, 0]}>
        <group>
          <mesh position={[0.8, 0, 0]}>
            <octahedronGeometry args={[0.12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.7} />
          </mesh>
        </group>
      </mesh>

      <pointLight ref={glowRef} position={[0, 1.5, 0]} color={color} intensity={3} distance={10} decay={2} />
    </group>
  )
}

export function World() {
  return (
    <>
      {/* Sky & atmosphere */}
      <Sky sunPosition={[50, 15, -50]} rayleigh={2} turbidity={8} mieCoefficient={0.005} />
      <fog attach="fog" args={['#0a0a18', 20, 70]} />

      {/* Lighting */}
      <ambientLight intensity={0.25} color="#8888cc" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
        color="#c8c0ff"
      />
      <hemisphereLight args={['#2a1a4e', '#0a0a18', 0.4]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#111122" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* subtle inner ground disc for gradient feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial color="#1a1a30" transparent opacity={0.5} />
      </mesh>

      <Grid
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#222238"
        sectionSize={5}
        sectionThickness={0.8}
        sectionColor="#333355"
        fadeDistance={40}
        position={[0, 0.01, 0]}
      />

      {/* Environment objects */}
      <Rocks />
      <Pillars />

      {/* Atmosphere */}
      <FloatingMotes />

      {/* Zones */}
      {Object.keys(ZONE_POSITIONS).map((name) => (
        <ZoneMarker key={name} name={name} />
      ))}
    </>
  )
}
