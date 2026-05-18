import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  className?: string
  children: React.ReactNode
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-white/10 text-foreground': variant === 'default',
          'bg-emerald-500/15 text-emerald-400': variant === 'success',
          'bg-amber-500/15 text-amber-400': variant === 'warning',
          'bg-red-500/15 text-red-400': variant === 'error',
          'bg-blue-500/15 text-blue-400': variant === 'info',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
