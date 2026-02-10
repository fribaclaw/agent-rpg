import { useEffect, useState } from 'react'
import { useGameStore } from '../store'

export function HUD() {
  const panelOpen = useGameStore((s) => s.panelOpen)
  const nearestZone = useGameStore((s) => s.nearestZone)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (panelOpen) return null

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 font-mono select-none">
      {/* Controls help — fades out */}
      <div
        className={`transition-opacity duration-1000 text-xs tracking-widest uppercase ${showControls ? 'opacity-60' : 'opacity-0'}`}
        style={{ color: '#8888aa' }}
      >
        WASD move · Mouse look · E interact · Click to capture
      </div>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-5 h-5 flex items-center justify-center">
          <div className="absolute w-[1px] h-3 bg-white/30" />
          <div className="absolute w-3 h-[1px] bg-white/30" />
          <div className="absolute w-1 h-1 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-2">
        {/* Zone name display */}
        {nearestZone && (
          <div className="flex flex-col items-center gap-1">
            <div
              className="text-[10px] uppercase tracking-[0.3em] font-mono"
              style={{ color: '#666688' }}
            >
              Zone
            </div>
            <div
              className="px-5 py-2 rounded border text-sm tracking-wider"
              style={{
                background: 'rgba(20, 15, 40, 0.85)',
                borderColor: 'rgba(168, 85, 247, 0.4)',
                color: '#d4b8ff',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)',
              }}
            >
              ⬡ Press <span className="text-white font-bold">E</span> — {nearestZone}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
