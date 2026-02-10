import { create } from 'zustand'

interface PlayerState {
  position: [number, number, number]
  rotation: number // y-axis rotation in radians
  setPosition: (pos: [number, number, number]) => void
  setRotation: (rot: number) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  position: [0, 0, 0],
  rotation: 0,
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
}))
