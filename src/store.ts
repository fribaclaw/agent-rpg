import { create } from 'zustand'

interface AppState {
  panelOpen: boolean
  activePanel: string | null
  openPanel: (panel: string) => void
  closePanel: () => void
}

export const useStore = create<AppState>((set) => ({
  panelOpen: false,
  activePanel: null,
  openPanel: (panel) => set({ panelOpen: true, activePanel: panel }),
  closePanel: () => set({ panelOpen: false, activePanel: null }),
}))
