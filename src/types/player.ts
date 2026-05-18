export type PlayerPhase = 'idle' | 'playing' | 'paused' | 'transitioning' | 'ended'

export interface Segment {
  start: number
  end: number
  label?: string
}

export interface CtaConfig {
  timestamp: number
  text: string
  url: string
  style?: 'primary' | 'outline'
}

export interface VideoSource {
  playbackUrl: string
  thumbnailUrl?: string
}

export interface PlayerConfig {
  videoId: string
  sessionId: string

  // Mode A: single video with timestamp segments
  playbackUrl?: string
  segments?: Segment[]

  // Mode B: multiple videos (each = one bar)
  videos?: VideoSource[]

  // Overlay
  expertName?: string
  expertAvatarUrl?: string

  // Behavior
  ctas?: CtaConfig[]
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

export interface PlayerState {
  phase: PlayerPhase
  currentSegmentIndex: number
  segmentProgress: number[]
  currentTime: number
  duration: number
  isMuted: boolean
  isPaused: boolean
  visibleCtas: number[]
}

export type PlayerMode = 'segments' | 'multi-video'
