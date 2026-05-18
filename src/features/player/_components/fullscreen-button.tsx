'use client'

import { Maximize2, Minimize2 } from 'lucide-react'
import { useState } from 'react'

interface FullscreenButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function FullscreenButton({ containerRef }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  function toggle(e: React.MouseEvent) {
    e.stopPropagation()
    const el = containerRef.current
    if (!el) return

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  return (
    <button
      onClick={toggle}
      className="absolute bottom-[72px] right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60"
      title={isFullscreen ? 'Sair de tela cheia' : 'Tela cheia'}
    >
      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
    </button>
  )
}
