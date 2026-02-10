import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './components/Scene'
import { ConfigPanel } from './components/ConfigPanel'
import { HUD } from './components/HUD'

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [nearInteractable, setNearInteractable] = useState(false)

  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ fov: 60, near: 0.1, far: 200 }}>
        <Scene
          onInteract={() => setPanelOpen(p => !p)}
          onNearChange={setNearInteractable}
          panelOpen={panelOpen}
        />
      </Canvas>

      <HUD nearInteractable={nearInteractable} panelOpen={panelOpen} />

      {panelOpen && <ConfigPanel onClose={() => setPanelOpen(false)} />}
    </div>
  )
}
