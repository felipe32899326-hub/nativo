'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PlayerConfig, CtaConfig } from '@/types/player'
import { usePlayer } from '../_lib/use-player'
import { VideoLayer } from './video-layer'
import { StoryProgressBar } from './story-progress-bar'
import { OverlayLayer } from './overlay-layer'
import { CtaLayer } from './cta-layer'
import { TapZones } from './tap-zones'
import { MuteButton } from './mute-button'
import { FullscreenButton } from './fullscreen-button'
import { Play } from 'lucide-react'

interface NativoPlayerProps {
  config: PlayerConfig
  onCtaClick?: (cta: CtaConfig, index: number) => void
  className?: string
}

export function NativoPlayer({ config, onCtaClick, className }: NativoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    state,
    currentPlaybackUrl,
    segments,
    goToNext,
    goToPrev,
    goToSegment,
    toggleMute,
    togglePlay,
  } = usePlayer(config, videoRef)

  const { phase, isMuted, isPaused, segmentProgress, currentSegmentIndex, visibleCtas } = state

  function handleCtaClick(cta: CtaConfig, index: number) {
    onCtaClick?.(cta, index)
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-black select-none ${className ?? ''}`}
      style={{ aspectRatio: '9/16' }}
    >
      {/* Layer 0 — Video */}
      <VideoLayer
        videoRef={videoRef}
        playbackUrl={currentPlaybackUrl}
        isMuted={isMuted}
        autoplay={config.autoplay ?? true}
      />

      {/* Layer 1 — Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Layer 2 — Progress bars */}
      <div className="absolute top-0 left-0 right-0 pt-3 z-20">
        <StoryProgressBar
          segments={segments}
          segmentProgress={segmentProgress}
          currentSegmentIndex={currentSegmentIndex}
          onSegmentClick={goToSegment}
        />
      </div>

      {/* Layer 3 — Expert overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <OverlayLayer
          expertName={config.expertName}
          expertAvatarUrl={config.expertAvatarUrl}
        />
      </div>

      {/* Layer 4 — CTA */}
      <div className="absolute inset-0 z-40">
        <CtaLayer
          ctas={config.ctas ?? []}
          visibleCtaIndices={visibleCtas}
          onCtaClick={handleCtaClick}
        />
      </div>

      {/* Layer 5 — Tap zones */}
      <div className="absolute inset-0 z-50">
        <TapZones
          onTapLeft={goToPrev}
          onTapRight={goToNext}
          onTapCenter={togglePlay}
        />
      </div>

      {/* Layer 6 — Controls */}
      <div className="absolute inset-0 z-60 pointer-events-none">
        <div className="pointer-events-auto">
          <MuteButton isMuted={isMuted} onToggle={toggleMute} />
          <FullscreenButton containerRef={containerRef} />
        </div>
      </div>

      {/* Idle / paused overlay */}
      <AnimatePresence>
        {(phase === 'idle' || isPaused) && (
          <motion.div
            className="absolute inset-0 z-70 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <Play size={22} className="text-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ended overlay */}
      <AnimatePresence>
        {phase === 'ended' && (
          <motion.div
            className="absolute inset-0 z-70 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-white font-medium mb-4">Vídeo finalizado</p>
            <button
              className="rounded-xl bg-white/10 border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/20 transition-colors"
              onClick={() => goToSegment(0)}
            >
              Assistir novamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
