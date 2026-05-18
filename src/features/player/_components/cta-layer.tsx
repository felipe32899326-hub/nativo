'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { CtaConfig } from '@/types/player'

interface CtaLayerProps {
  ctas: CtaConfig[]
  visibleCtaIndices: number[]
  onCtaClick: (cta: CtaConfig, index: number) => void
}

export function CtaLayer({ ctas, visibleCtaIndices, onCtaClick }: CtaLayerProps) {
  // Show the last visible CTA (highest timestamp that has been crossed)
  const lastVisible = visibleCtaIndices.at(-1)
  const activeCta = lastVisible !== undefined ? ctas[lastVisible] : null

  return (
    <div className="absolute bottom-4 left-0 right-0 px-4">
      <AnimatePresence mode="wait">
        {activeCta && (
          <motion.button
            key={lastVisible}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={() => {
              onCtaClick(activeCta, lastVisible!)
              window.open(activeCta.url, '_blank', 'noopener,noreferrer')
            }}
            className={`
              w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-center
              transition-opacity active:opacity-80
              shadow-lg shadow-black/30
              ${activeCta.style === 'outline'
                ? 'border-2 border-white/80 text-white bg-black/20 backdrop-blur-sm'
                : 'bg-white text-black hover:bg-white/95'
              }
            `}
          >
            {activeCta.text}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
