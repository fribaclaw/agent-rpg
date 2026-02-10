import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store'

const MOVE_SPEED = 6

export function Player() {
  const groupRef = useRef<THREE.Group>(null!)
  const keys = useRef<Record<string, boolean>>({})
  const yawRef = useRef(0)
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
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#6cf" />
      </mesh>
    </group>
  )
}
