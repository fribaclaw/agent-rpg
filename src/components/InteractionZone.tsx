import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../store'

const INTERACT_DISTANCE = 3

interface InteractionZoneProps {
  name: string
  position: [number, number, number]
}

export function InteractionZone({ name, position }: InteractionZoneProps) {
  const zonePos = useRef(new THREE.Vector3(...position))
  const playerPosition = useGameStore((s) => s.playerPosition)
  const nearestZone = useGameStore((s) => s.nearestZone)
  const setNearestZone = useGameStore((s) => s.setNearestZone)

  useFrame(() => {
    const playerVec = new THREE.Vector3(...playerPosition)
    const dist = playerVec.distanceTo(zonePos.current)

    if (dist < INTERACT_DISTANCE) {
      if (nearestZone !== name) setNearestZone(name)
    } else if (nearestZone === name) {
      setNearestZone(null)
    }
  })

  // Invisible trigger volume — visuals are in World.tsx
  return null
}
