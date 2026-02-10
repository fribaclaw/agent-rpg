import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { MOCK_SOUL_MD } from '../mockData'

export function ConfigPanel() {
  const { panelOpen, activePanel, closePanel } = useStore()
  const [content, setContent] = useState(MOCK_SOUL_MD)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    if (panelOpen) {
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }
  }, [panelOpen, closePanel])

  if (!panelOpen) return null

  const title = activePanel ?? 'Soul Chamber'

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
      onClick={(e) => { if (e.target === e.currentTarget) closePanel() }}
    >
      <div className="bg-gray-900/95 border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-500/20 w-[620px] max-h-[80vh] flex flex-col animate-fade-in">
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
            <h2 className="text-purple-300 font-bold text-lg tracking-wide">{title}</h2>
          </div>
          <button
            onClick={closePanel}
            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-auto">
          <label className="text-gray-400 text-sm mb-2 block font-medium">
            SOUL.md — Agent Identity Config
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-80 bg-gray-800 text-gray-200 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-500/30 flex justify-between items-center">
          <span className="text-gray-600 text-xs">Press Escape to close</span>
          <div className="flex gap-3">
            <button
              onClick={closePanel}
              className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => console.log('[ConfigPanel] Save:', content)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
