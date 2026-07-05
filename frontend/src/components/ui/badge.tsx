 
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none transition-colors duration-150',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/85',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]',
        outline: 'text-foreground border-border bg-transparent',
        success:
          'border-transparent bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20',
        info: 'border-transparent bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20',
        warning:
          'border-transparent bg-yellow-500/10 text-yellow-800 dark:text-yellow-500 hover:bg-yellow-500/20',
        destructive:
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
export { badgeVariants }
