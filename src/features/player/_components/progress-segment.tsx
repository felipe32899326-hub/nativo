'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

interface ProgressSegmentProps {
  progress: number
  state: 'past' | 'active' | 'future'
}

export function ProgressSegment({ progress, state }: ProgressSegmentProps) {
  const motionProgress = useMotionValue(state === 'past' ? 1 : 0)
  const width = useTransform(motionProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    if (state === 'past') {
      animate(motionProgress, 1, { duration: 0.2 })
    } else if (state === 'future') {
      animate(motionProgress, 0, { duration: 0.2 })
    } else {
      motionProgress.set(progress)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, progress])

  return (
    <div className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-white"
        style={{ width }}
      />
    </div>
  )
}
