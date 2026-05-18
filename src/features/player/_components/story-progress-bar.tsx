'use client'

import { ProgressSegment } from './progress-segment'
import type { Segment } from '@/types/player'

interface StoryProgressBarProps {
  segments: Segment[]
  segmentProgress: number[]
  currentSegmentIndex: number
  onSegmentClick?: (index: number) => void
}

export function StoryProgressBar({
  segments,
  segmentProgress,
  currentSegmentIndex,
  onSegmentClick,
}: StoryProgressBarProps) {
  return (
    <div className="flex items-center gap-1 w-full px-3 pt-safe-top">
      {segments.map((_, i) => {
        const segState =
          i < currentSegmentIndex ? 'past' : i === currentSegmentIndex ? 'active' : 'future'

        return (
          <button
            key={i}
            className="flex-1 py-2 cursor-pointer appearance-none bg-transparent border-0 p-0"
            onClick={() => onSegmentClick?.(i)}
          >
            <ProgressSegment
              state={segState}
              progress={segmentProgress[i] ?? 0}
            />
          </button>
        )
      })}
    </div>
  )
}
