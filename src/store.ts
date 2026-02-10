import { create } from 'zustand'

interface GameState {
  // Player
  playerPosition: [number, number, number]
  setPlayerPosition: (pos: [number, number, number]) => void
  playerYaw: number
  setPlayerYaw: (yaw: number) => void

  // Panels
  panelOpen: boolean
  activePanel: string | null
  openPanel: (panel: string) => void
  closePanel: () => void

  // Interaction
  nearestZone: string | null
  setNearestZone: (zone: string | null) => void
}

export const useGameStore = create<GameState>((set) => ({
  playerPosition: [0, 0, 0],
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  playerYaw: 0,
  setPlayerYaw: (yaw) => set({ playerYaw: yaw }),

  panelOpen: false,
  activePanel: null,
  openPanel: (panel) => set({ panelOpen: true, activePanel: panel }),
  closePanel: () => set({ panelOpen: false, activePanel: null }),

  nearestZone: null,
  setNearestZone: (zone) => set({ nearestZone: zone }),
}))
