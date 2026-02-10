import { useState } from 'react'
import { MOCK_SOUL_MD } from '../mockData'

interface ConfigPanelProps {
  onClose: () => void
}

export function ConfigPanel({ onClose }: ConfigPanelProps) {
  const [content, setContent] = useState(MOCK_SOUL_MD)

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900/95 border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-500/20 w-[620px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
            <h2 className="text-purple-300 font-bold text-lg">Soul Chamber</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>
        <div className="p-6 flex-1 overflow-auto">
          <label className="text-gray-400 text-sm mb-2 block">SOUL.md — Agent Identity Config</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-80 bg-gray-800 text-gray-200 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
            spellCheck={false}
          />
        </div>
        <div className="px-6 py-4 border-t border-purple-500/30 flex justify-between items-center">
          <span className="text-gray-600 text-xs">Press ESC or E to close</span>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm transition">Save Config</button>
        </div>
      </div>
    </div>
  )
}
