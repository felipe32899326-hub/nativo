'use client'

import Image from 'next/image'

interface OverlayLayerProps {
  expertName?: string
  expertAvatarUrl?: string
}

export function OverlayLayer({ expertName, expertAvatarUrl }: OverlayLayerProps) {
  if (!expertName && !expertAvatarUrl) return null

  return (
    <div className="absolute bottom-16 left-0 right-0 px-4 pointer-events-none">
      <div className="flex items-center gap-2">
        {expertAvatarUrl && (
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/30 shrink-0">
            <Image
              src={expertAvatarUrl}
              alt={expertName ?? ''}
              fill
              className="object-cover"
            />
          </div>
        )}
        {expertName && (
          <p className="text-sm font-medium text-white drop-shadow-sm">{expertName}</p>
        )}
      </div>
    </div>
  )
}
