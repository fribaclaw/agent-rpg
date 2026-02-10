import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store'

const MOVE_SPEED = 6

/* Shared lobster material */
const LOBSTER_RED = '#b22020'
const LOBSTER_DARK = '#8b1a1a'
const CLAW_COLOR = '#cc2a2a'

function LobsterModel() {
  /* Pre-build materials once */
  const mBody = useMemo(() => ({ color: LOBSTER_RED, metalness: 0.35, roughness: 0.55 }), [])
  const mDark = useMemo(() => ({ color: LOBSTER_DARK, metalness: 0.35, roughness: 0.55 }), [])
  const mClaw = useMemo(() => ({ color: CLAW_COLOR, metalness: 0.4, roughness: 0.5 }), [])
  const mEye = useMemo(() => ({ color: '#111111', metalness: 0.1, roughness: 0.3 }), [])
  const mAntenna = useMemo(() => ({ color: LOBSTER_DARK, metalness: 0.3, roughness: 0.6 }), [])

  return (
    <group position={[0, 0.55, 0]}>
      {/* === BODY (ellipsoid) === */}
      <mesh castShadow scale={[0.4, 0.3, 0.7]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial {...mBody} />
      </mesh>

      {/* === TAIL — 4 segments tapering backward === */}
      {[0, 1, 2, 3].map((i) => {
        const s = 1 - i * 0.18
        return (
          <mesh key={`tail-${i}`} castShadow
            position={[0, -0.05 - i * 0.04, 0.55 + i * 0.32]}
            scale={[0.3 * s, 0.12 * s, 0.25]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial {...mDark} />
          </mesh>
        )
      })}
      {/* Tail fan */}
      <mesh castShadow position={[0, -0.12, 1.7]} scale={[0.35, 0.06, 0.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial {...mDark} />
      </mesh>

      {/* === CLAWS === */}
      {[-1, 1].map((side) => (
        <group key={`claw-${side}`} position={[side * 0.45, 0.05, -0.5]}>
          {/* Arm */}
          <mesh castShadow rotation={[0, 0, side * 0.3]} scale={[0.08, 0.08, 0.35]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial {...mClaw} />
          </mesh>
          {/* Pincer base */}
          <mesh castShadow position={[side * 0.08, 0, -0.35]} scale={[0.18, 0.1, 0.22]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial {...mClaw} />
          </mesh>
          {/* Pincer top */}
          <mesh castShadow position={[side * 0.08, 0.06, -0.5]} rotation={[0.25, 0, 0]}
            scale={[0.14, 0.04, 0.15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial {...mClaw} />
          </mesh>
          {/* Pincer bottom */}
          <mesh castShadow position={[side * 0.08, -0.06, -0.5]} rotation={[-0.25, 0, 0]}
            scale={[0.14, 0.04, 0.15]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial {...mClaw} />
          </mesh>
        </group>
      ))}

      {/* === LEGS — 3 per side === */}
      {[-1, 1].map((side) =>
        [0, 1, 2].map((i) => (
          <mesh key={`leg-${side}-${i}`} castShadow
            position={[side * 0.35, -0.2, -0.15 + i * 0.3]}
            rotation={[0, 0, side * 0.6]}
            scale={[1, 1, 1]}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
            <meshStandardMaterial {...mDark} />
          </mesh>
        ))
      )}

      {/* === EYES on stalks === */}
      {[-1, 1].map((side) => (
        <group key={`eye-${side}`} position={[side * 0.18, 0.25, -0.55]}>
          {/* Stalk */}
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.2, 6]} />
            <meshStandardMaterial {...mBody} />
          </mesh>
          {/* Eyeball */}
          <mesh castShadow position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial {...mEye} />
          </mesh>
        </group>
      ))}

      {/* === ANTENNAE === */}
      {[-1, 1].map((side) => (
        <mesh key={`ant-${side}`} castShadow
          position={[side * 0.12, 0.15, -0.65]}
          rotation={[−0.6, side * 0.3, 0]}
        >
          <cylinderGeometry args={[0.015, 0.008, 0.6, 6]} />
          <meshStandardMaterial {...mAntenna} />
        </mesh>
      ))}
    </group>
  )
}

export function Player() {
  const groupRef = useRef<THREE.Group>(null!)
  const lobsterRef = useRef<THREE.Group>(null!)
  const keys = useRef<Record<string, boolean>>({})
  const yawRef = useRef(0)
  const facingRef = useRef(0)
  const { camera } = useThree()
  const panelOpen = useGameStore((s) => s.panelOpen)
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition)
  const setPlayerYaw = useGameStore((s) => s.setPlayerYaw)
  const activePanel = useGameStore((s) => s.activePanel)
  const nearestZone = useGameStore((s) => s.nearestZone)
  const openPanel = useGameStore((s) => s.openPanel)

  useEffect(() => {
    const onPointerMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yawRef.current -= e.movementX * 0.002
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (e.code === 'KeyE' && nearestZone && !activePanel) {
        openPanel(nearestZone)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    const onClick = () => {
      if (!panelOpen) document.body.requestPointerLock()
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
  }, [panelOpen, nearestZone, activePanel, openPanel])

  useEffect(() => {
    if (panelOpen) document.exitPointerLock()
  }, [panelOpen])

  useFrame((_, delta) => {
    if (!groupRef.current || panelOpen) return

    const dir = new THREE.Vector3()
    if (keys.current['KeyW']) dir.z -= 1
    if (keys.current['KeyS']) dir.z += 1
    if (keys.current['KeyA']) dir.x -= 1
    if (keys.current['KeyD']) dir.x += 1
    dir.normalize()
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawRef.current)
    groupRef.current.position.addScaledVector(dir, MOVE_SPEED * delta)

    /* Rotate lobster to face movement direction */
    if (dir.lengthSq() > 0.001 && lobsterRef.current) {
      const targetAngle = Math.atan2(dir.x, dir.z)
      // Smoothly interpolate facing
      let diff = targetAngle - facingRef.current
      // Wrap to [-PI, PI]
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      facingRef.current += diff * Math.min(1, 10 * delta)
      lobsterRef.current.rotation.y = facingRef.current + Math.PI // +PI because lobster faces -Z
    }

    const p = groupRef.current.position
    setPlayerPosition([p.x, p.y, p.z])
    setPlayerYaw(yawRef.current)

    const camOffset = new THREE.Vector3(0, 4, 6).applyAxisAngle(
      new THREE.Vector3(0, 1, 0), yawRef.current
    )
    camera.position.lerp(p.clone().add(camOffset), 0.1)
    camera.lookAt(p.clone().add(new THREE.Vector3(0, 1, 0)))
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group ref={lobsterRef}>
        <LobsterModel />
      </group>
    </group>
  )
}
