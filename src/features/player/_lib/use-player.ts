'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PlayerConfig, PlayerPhase, PlayerState, Segment } from '@/types/player'

const DEFAULT_STATE: PlayerState = {
  phase: 'idle',
  currentSegmentIndex: 0,
  segmentProgress: [],
  currentTime: 0,
  duration: 0,
  isMuted: true,
  isPaused: false,
  visibleCtas: [],
}

export function usePlayer(config: PlayerConfig, videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [state, setState] = useState<PlayerState>({
    ...DEFAULT_STATE,
    isMuted: config.muted ?? true,
    segmentProgress: new Array(getSegmentCount(config)).fill(0),
  })
  const rafRef = useRef<number | null>(null)
  const hasStartedRef = useRef(false)

  const segments = resolveSegments(config)

  // --- computed current playback URL (for multi-video mode) ---
  const currentPlaybackUrl = getPlaybackUrl(config, state.currentSegmentIndex)

  // --- progress animation loop ---
  const updateProgress = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const currentTime = video.currentTime
    const currentSeg = segments[state.currentSegmentIndex]

    if (!currentSeg) return

    const progress = Math.min(
      1,
      (currentTime - currentSeg.start) / Math.max(1, currentSeg.end - currentSeg.start),
    )

    setState((prev) => {
      const next = [...prev.segmentProgress]
      next[prev.currentSegmentIndex] = progress

      // Reveal CTAs
      const visibleCtas = (config.ctas ?? [])
        .map((cta, i) => (currentTime >= cta.timestamp ? i : -1))
        .filter((i) => i !== -1)

      return { ...prev, currentTime, segmentProgress: next, visibleCtas }
    })

    // Check if we've crossed the segment end
    if (currentTime >= currentSeg.end - 0.1) {
      goToNext()
      return
    }

    rafRef.current = requestAnimationFrame(updateProgress)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentSegmentIndex, segments, config.ctas])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function onPlay() {
      setState((p) => ({ ...p, phase: 'playing', isPaused: false }))
      hasStartedRef.current = true
      rafRef.current = requestAnimationFrame(updateProgress)
    }

    function onPause() {
      setState((p) => ({ ...p, phase: 'paused', isPaused: true }))
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }

    function onEnded() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const isLastSegment = state.currentSegmentIndex >= segments.length - 1
      if (isLastSegment) {
        if (config.loop) {
          goToSegment(0)
        } else {
          setState((p) => ({ ...p, phase: 'ended' }))
        }
      } else {
        goToNext()
      }
    }

    function onLoadedMetadata() {
      setState((p) => ({ ...p, duration: video!.duration }))
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('ended', onEnded)
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProgress, state.currentSegmentIndex])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const goToSegment = useCallback(
    (index: number) => {
      const video = videoRef.current
      if (!video) return

      const clamped = Math.max(0, Math.min(index, segments.length - 1))
      const seg = segments[clamped]

      setState((prev) => {
        const next = [...prev.segmentProgress]
        // Fill past segments
        for (let i = 0; i < clamped; i++) next[i] = 1
        // Reset current and future
        next[clamped] = 0
        for (let i = clamped + 1; i < next.length; i++) next[i] = 0
        return { ...prev, currentSegmentIndex: clamped, segmentProgress: next, phase: 'transitioning' }
      })

      // For Mode A: seek in the same video
      if (config.playbackUrl && seg) {
        video.currentTime = seg.start
        video.play().catch(() => {})
      }
      // For Mode B: source swap handled by VideoLayer watching currentPlaybackUrl
    },
    [config.playbackUrl, segments, videoRef],
  )

  const goToNext = useCallback(() => {
    const nextIndex = state.currentSegmentIndex + 1
    if (nextIndex >= segments.length) {
      if (config.loop) goToSegment(0)
      else setState((p) => ({ ...p, phase: 'ended' }))
    } else {
      goToSegment(nextIndex)
    }
  }, [state.currentSegmentIndex, segments.length, config.loop, goToSegment])

  const goToPrev = useCallback(() => {
    goToSegment(Math.max(0, state.currentSegmentIndex - 1))
  }, [state.currentSegmentIndex, goToSegment])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setState((p) => ({ ...p, isMuted: video.muted }))
  }, [videoRef])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }, [videoRef])

  return {
    state,
    currentPlaybackUrl,
    segments,
    goToNext,
    goToPrev,
    goToSegment,
    toggleMute,
    togglePlay,
  }
}

// --- helpers ---

function getSegmentCount(config: PlayerConfig): number {
  if (config.videos?.length) return config.videos.length
  if (config.segments?.length) return config.segments.length
  return 1
}

function resolveSegments(config: PlayerConfig): Segment[] {
  if (config.segments?.length) return config.segments
  if (config.videos?.length) {
    // Multi-video: each video is its own "segment" from 0 to Infinity (video ends naturally)
    return config.videos.map((_, i) => ({ start: 0, end: Infinity, label: `Parte ${i + 1}` }))
  }
  return [{ start: 0, end: Infinity }]
}

function getPlaybackUrl(config: PlayerConfig, segmentIndex: number): string | undefined {
  if (config.videos?.length) {
    return config.videos[segmentIndex]?.playbackUrl
  }
  return config.playbackUrl
}
