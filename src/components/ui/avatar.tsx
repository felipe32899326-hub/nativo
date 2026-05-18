import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function getInitials(name?: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizeMap = { sm: 24, md: 32, lg: 40 }
  const px = sizeMap[size]

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-raised',
        {
          'h-6 w-6 text-[10px]': size === 'sm',
          'h-8 w-8 text-xs': size === 'md',
          'h-10 w-10 text-sm': size === 'lg',
        },
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? ''}
          width={px}
          height={px}
          className="object-cover"
        />
      ) : (
        <span className="font-medium text-muted-foreground">{getInitials(name)}</span>
      )}
    </div>
  )
}
