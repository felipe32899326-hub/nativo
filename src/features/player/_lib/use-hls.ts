'use client'

import { useEffect, useRef } from 'react'

export function useHls(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  playbackUrl: string | undefined,
) {
  const hlsRef = useRef<import('hls.js').default | null>(null)

  useEffect(() => {
    if (!videoRef.current || !playbackUrl) return

    const video = videoRef.current

    async function attachHls() {
      const Hls = (await import('hls.js')).default

      if (Hls.isSupported()) {
        hlsRef.current?.destroy()

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
        })

        hls.loadSource(playbackUrl!)
        hls.attachMedia(video!)
        hlsRef.current = hls
      } else if (video!.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari)
        video!.src = playbackUrl!
      }
    }

    attachHls()

    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackUrl])
}
