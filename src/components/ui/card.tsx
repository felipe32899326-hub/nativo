import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn('flex flex-col gap-1 mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h3 className={cn('text-base font-semibold text-foreground', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }: CardProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn(className)}>{children}</div>
}

export function CardFooter({ className, children }: CardProps) {
  return (
    <div className={cn('flex items-center gap-3 mt-4 pt-4 border-t border-border', className)}>
      {children}
    </div>
  )
}
