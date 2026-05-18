import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef, type ReactElement, cloneElement } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'accent'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  asChild?: boolean
}

const buttonClasses = ({
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
}: Pick<ButtonProps, 'variant' | 'size' | 'loading' | 'disabled' | 'className'>) =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    (disabled || loading) && 'opacity-40 cursor-not-allowed pointer-events-none',
    {
      'bg-white text-black hover:bg-white/90 active:scale-[0.98]': variant === 'default',
      'border border-border bg-transparent text-foreground hover:bg-surface-raised active:scale-[0.98]': variant === 'outline',
      'bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-raised': variant === 'ghost',
      'bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98]': variant === 'destructive',
      'bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98]': variant === 'accent',
      'h-7 px-3 text-xs': size === 'sm',
      'h-9 px-4 text-sm': size === 'md',
      'h-11 px-6 text-base': size === 'lg',
      'h-9 w-9 p-0': size === 'icon',
    },
    className,
  )

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, disabled, children, asChild, ...props }, ref) => {
    const classes = buttonClasses({ variant, size, loading, disabled, className })

    if (asChild && children) {
      const child = children as ReactElement<{ className?: string; children?: React.ReactNode }>
      return cloneElement(child, {
        className: cn(classes, child.props.className),
        children: (
          <>
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {child.props.children}
          </>
        ),
      })
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
