import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../store'

const MOVE_SPEED = 5
const MOUSE_SENSITIVITY = 0.002
const CAMERA_OFFSET = new THREE.Vector3(0, 4, 8)
const CAMERA_LERP = 0.08

export function Player() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const keys = useRef<Record<string, boolean>>({})
  const yaw = useRef(0)
  const pitch = useRef(-0.3)
  const isLocked = useRef(false)

  const { camera, gl } = useThree()
  const setPosition = usePlayerStore((s) => s.setPosition)
  const setRotation = usePlayerStore((s) => s.setRotation)

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.code] = true }
    const up = (e: KeyboardEvent) => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // Pointer lock
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isLocked.current) return
    yaw.current -= e.movementX * MOUSE_SENSITIVITY
    pitch.current = Math.max(-1.2, Math.min(0.5, pitch.current - e.movementY * MOUSE_SENSITIVITY))
  }, [])

  useEffect(() => {
    const canvas = gl.domElement
    const requestLock = () => canvas.requestPointerLock()
    const onLockChange = () => { isLocked.current = document.pointerLockElement === canvas }
    canvas.addEventListener('click', requestLock)
    document.addEventListener('pointerlockchange', onLockChange)
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      canvas.removeEventListener('click', requestLock)
      document.removeEventListener('pointerlockchange', onLockChange)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl, onMouseMove])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    // Movement relative to yaw
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
    const right = new THREE.Vector3(forward.z, 0, -forward.x)
    const move = new THREE.Vector3()

    const k = keys.current
    if (k['KeyW'] || k['ArrowUp']) move.add(forward)
    if (k['KeyS'] || k['ArrowDown']) move.sub(forward)
    if (k['KeyA'] || k['ArrowLeft']) move.sub(right)
    if (k['KeyD'] || k['ArrowRight']) move.add(right)

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(MOVE_SPEED * delta)
      mesh.position.add(move)
    }

    // Update store
    const p = mesh.position
    setPosition([p.x, p.y, p.z])
    setRotation(yaw.current)

    // Third-person camera
    const offset = CAMERA_OFFSET.clone()
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch.current)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current)

    const desiredPos = mesh.position.clone().add(offset)
    camera.position.lerp(desiredPos, CAMERA_LERP)
    camera.lookAt(mesh.position.x, mesh.position.y + 1.2, mesh.position.z)
  })

  return (
    <mesh ref={meshRef} position={[0, 0.75, 0]} castShadow>
      <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
      <meshStandardMaterial color="#4a90d9" roughness={0.4} metalness={0.3} />
    </mesh>
  )
}

export default Player
