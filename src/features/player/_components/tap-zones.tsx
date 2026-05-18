'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TapZonesProps {
  onTapLeft: () => void
  onTapRight: () => void
  onTapCenter: () => void
}

export function TapZones({ onTapLeft, onTapRight, onTapCenter }: TapZonesProps) {
  const [ripple, setRipple] = useState<{ side: 'left' | 'right'; key: number } | null>(null)

  function handleLeft() {
    setRipple({ side: 'left', key: Date.now() })
    onTapLeft()
  }

  function handleRight() {
    setRipple({ side: 'right', key: Date.now() })
    onTapRight()
  }

  return (
    <div className="absolute inset-0 flex">
      {/* Left tap zone — 40% */}
      <div className="w-[40%] relative" onClick={handleLeft}>
        <AnimatePresence>
          {ripple?.side === 'left' && (
            <motion.div
              key={ripple.key}
              className="absolute inset-0 bg-white/10 rounded-full m-4"
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Center tap zone — 20% (play/pause) */}
      <div className="w-[20%]" onClick={onTapCenter} />

      {/* Right tap zone — 40% */}
      <div className="w-[40%] relative" onClick={handleRight}>
        <AnimatePresence>
          {ripple?.side === 'right' && (
            <motion.div
              key={ripple.key}
              className="absolute inset-0 bg-white/10 rounded-full m-4"
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{ opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
