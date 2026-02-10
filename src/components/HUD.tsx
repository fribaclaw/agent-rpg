interface HUDProps {
  nearInteractable: boolean
  panelOpen: boolean
}

export function HUD({ nearInteractable, panelOpen }: HUDProps) {
  if (panelOpen) return null

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
      {/* Top */}
      <div className="text-gray-500 text-sm">
        WASD to move · Mouse to look · Click to capture cursor
      </div>

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-2 h-2 rounded-full border border-white/40" />
      </div>

      {/* Bottom interact prompt */}
      <div className="h-8">
        {nearInteractable && (
          <div className="bg-purple-600/80 text-white px-4 py-2 rounded-lg text-sm animate-pulse">
            Press E to interact — Soul Chamber
          </div>
        )}
      </div>
    </div>
  )
}
