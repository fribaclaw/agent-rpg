import { useEffect, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useGameStore } from '../store'

interface InteractionZoneProps {
  position: [number, number, number]
  label: string
  radius: number
  panelId: string
}

export function InteractionZone({ position, label, radius, panelId }: InteractionZoneProps) {
  const playerPosition = useGameStore((s) => s.playerPosition)
  const panelOpen = useGameStore((s) => s.panelOpen)
  const togglePanel = useGameStore((s) => s.togglePanel)

  const inRange = useMemo(() => {
    const dx = playerPosition[0] - position[0]
    const dy = playerPosition[1] - position[1]
    const dz = playerPosition[2] - position[2]
    return Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius
  }, [playerPosition, position, radius])

  useEffect(() => {
    if (!inRange) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        togglePanel(panelId)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [inRange, panelId, togglePanel])

  return (
    <group position={position}>
      {/* Visual marker */}
      <mesh>
        <ringGeometry args={[radius - 0.05, radius, 32]} />
        <meshBasicMaterial color={inRange ? '#22d3ee' : '#6b7280'} transparent opacity={0.35} />
      </mesh>

      {inRange && panelOpen !== panelId && (
        <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(0,0,0,0.75)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 14,
              whiteSpace: 'nowrap',
              fontFamily: 'sans-serif',
            }}
          >
            Press <kbd style={{ fontWeight: 'bold' }}>E</kbd> to {label}
          </div>
        </Html>
      )}
    </group>
  )
}

export default InteractionZone
