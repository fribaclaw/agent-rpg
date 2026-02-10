import { Canvas } from '@react-three/fiber'
import { World, ZONE_POSITIONS } from './components/World'
import { Player } from './components/Player'
import { InteractionZone } from './components/InteractionZone'
import { ConfigPanel } from './components/ConfigPanel'
import { HUD } from './components/HUD'

export default function App() {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ fov: 60, near: 0.1, far: 200 }}>
        <World />
        <Player />
        {Object.entries(ZONE_POSITIONS).map(([name, pos]) => (
          <InteractionZone key={name} name={name} position={pos} />
        ))}
      </Canvas>

      <HUD />
      <ConfigPanel />
    </div>
  )
}
