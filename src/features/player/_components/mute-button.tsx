'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MuteButtonProps {
  isMuted: boolean
  onToggle: () => void
}

export function MuteButton({ isMuted, onToggle }: MuteButtonProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      className="absolute top-14 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60"
      title={isMuted ? 'Ativar som' : 'Silenciar'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isMuted ? 'muted' : 'unmuted'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
