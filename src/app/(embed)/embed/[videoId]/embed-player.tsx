'use client'

import { useEffect, useRef } from 'react'
import { NativoPlayer } from '@/features/player/_components/nativo-player'
import {
  trackPlay,
  trackHeartbeat,
  trackCtaClick,
  trackEnd,
} from '@/features/player/_lib/player-analytics'
import type { PlayerConfig, CtaConfig } from '@/types/player'

interface EmbedPlayerProps {
  config: PlayerConfig
}

export function EmbedPlayer({ config }: EmbedPlayerProps) {
  const sessionId = useRef<string>('')
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
  const watchSecondsRef = useRef(0)
  const hasTrackedPlay = useRef(false)

  useEffect(() => {
    // Generate or reuse session ID
    const existing = sessionStorage.getItem(`nativo_session_${config.videoId}`)
    if (existing) {
      sessionId.current = existing
    } else {
      const id = crypto.randomUUID()
      sessionId.current = id
      sessionStorage.setItem(`nativo_session_${config.videoId}`, id)
    }

    if (!hasTrackedPlay.current) {
      hasTrackedPlay.current = true
      trackPlay(config.videoId, sessionId.current)
    }

    // Heartbeat every 5s
    heartbeatRef.current = setInterval(() => {
      watchSecondsRef.current += 5
      trackHeartbeat(config.videoId, sessionId.current, 0, 0, watchSecondsRef.current)
    }, 5000)

    // Track end on page unload
    function handleUnload() {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
      trackEnd(config.videoId, sessionId.current, watchSecondsRef.current, false, null)
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
      window.removeEventListener('beforeunload', handleUnload)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCtaClick(cta: CtaConfig, index: number) {
    trackCtaClick(config.videoId, sessionId.current, index, cta.url, watchSecondsRef.current)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="h-full max-h-screen" style={{ aspectRatio: '9/16' }}>
        <NativoPlayer
          config={config}
          onCtaClick={handleCtaClick}
          className="h-full w-full rounded-none"
        />
      </div>
    </div>
  )
}
