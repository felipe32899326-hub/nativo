'use client'

import { useEffect } from 'react'
import { useHls } from '../_lib/use-hls'

interface VideoLayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  playbackUrl: string | undefined
  isMuted: boolean
  autoplay?: boolean
}

export function VideoLayer({ videoRef, playbackUrl, isMuted, autoplay }: VideoLayerProps) {
  useHls(videoRef, playbackUrl)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoplay) return

    const tryAutoplay = () => {
      video.muted = true
      video.play().catch(() => {})
    }

    if (video.readyState >= 3) {
      tryAutoplay()
    } else {
      video.addEventListener('canplay', tryAutoplay, { once: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, playbackUrl])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      muted={isMuted}
      playsInline
      preload="metadata"
      crossOrigin="anonymous"
    />
  )
}
