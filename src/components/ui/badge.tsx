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
          'bg-muted text-foreground': variant === 'default',
          'bg-emerald-100 text-emerald-700': variant === 'success',
          'bg-amber-100 text-amber-700': variant === 'warning',
          'bg-red-100 text-red-700': variant === 'error',
          'bg-blue-100 text-blue-700': variant === 'info',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
