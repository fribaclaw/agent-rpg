import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Grid, Sky } from '@react-three/drei'
import * as THREE from 'three'

const MOVE_SPEED = 6
const INTERACT_DISTANCE = 3
const SOUL_CHAMBER_POS = new THREE.Vector3(0, 0, -8)

// Placeholder zone markers for future expansion
const FUTURE_ZONES = [
  { pos: [8, 0.5, -4] as [number, number, number], color: '#444', label: 'Memory Vault' },
  { pos: [-8, 0.5, -4] as [number, number, number], color: '#444', label: 'Tool Forge' },
  { pos: [0, 0.5, 8] as [number, number, number], color: '#444', label: 'Channel Hub' },
]

interface SceneProps {
  onInteract: () => void
  onNearChange: (near: boolean) => void
  panelOpen: boolean
}

export function Scene({ onInteract, onNearChange, panelOpen }: SceneProps) {
  const playerRef = useRef<THREE.Group>(null!)
  const keys = useRef<Record<string, boolean>>({})
  const yaw = useRef(0)
  const { camera } = useThree()

  // Track mouse for camera look
  useEffect(() => {
    const onPointerMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yaw.current -= e.movementX * 0.002
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (e.code === 'KeyE') onInteract()
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    const onClick = () => {
      if (!panelOpen) {
        document.body.requestPointerLock()
      }
    }

    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('click', onClick)
    }
  }, [onInteract, panelOpen])

  // Release pointer lock when panel opens
  useEffect(() => {
    if (panelOpen) document.exitPointerLock()
  }, [panelOpen])

  useFrame((_, delta) => {
    if (!playerRef.current || panelOpen) return

    const dir = new THREE.Vector3()
    if (keys.current['KeyW']) dir.z -= 1
    if (keys.current['KeyS']) dir.z += 1
    if (keys.current['KeyA']) dir.x -= 1
    if (keys.current['KeyD']) dir.x += 1
    dir.normalize()

    // Rotate direction by yaw
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current)
    playerRef.current.position.addScaledVector(dir, MOVE_SPEED * delta)

    // Camera follow
    const camOffset = new THREE.Vector3(0, 4, 6).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yaw.current
    )
    camera.position.lerp(playerRef.current.position.clone().add(camOffset), 0.1)
    camera.lookAt(playerRef.current.position.clone().add(new THREE.Vector3(0, 1, 0)))

    // Check proximity to Soul Chamber
    const dist = playerRef.current.position.distanceTo(SOUL_CHAMBER_POS)
    onNearChange(dist < INTERACT_DISTANCE)
  })

  return (
    <>
      <Sky sunPosition={[50, 30, -50]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1} castShadow />

      {/* Ground */}
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

      {/* Player */}
      <group ref={playerRef} position={[0, 0, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial color="#6cf" />
        </mesh>
      </group>

      {/* Soul Chamber */}
      <SoulChamber />

      {/* Future zone placeholders */}
      {FUTURE_ZONES.map((zone, i) => (
        <group key={i} position={zone.pos}>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={zone.color} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function SoulChamber() {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = 1.2 + Math.sin(t * 2) * 0.15
    ref.current.rotation.y = t * 0.5
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(t * 3) * 0.8
    }
  })

  return (
    <group position={[SOUL_CHAMBER_POS.x, 0, SOUL_CHAMBER_POS.z]}>
      {/* Base pedestal */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.5, 8]} />
        <meshStandardMaterial color="#2a1a4e" />
      </mesh>

      {/* Floating crystal */}
      <mesh ref={ref} position={[0, 1.2, 0]} castShadow>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Glow light */}
      <pointLight ref={glowRef} position={[0, 1.5, 0]} color="#a855f7" intensity={2} distance={8} />
    </group>
  )
}
