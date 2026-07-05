import React from 'react'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  className,
  icon = <FileText className="size-7 text-muted-foreground/50" />,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-10',
        'border border-dashed border-border/60 bg-muted/10',
        'rounded-2xl max-w-sm mx-auto w-full',
        className
      )}
      {...props}
    >
      {/* Icon circle */}
      <div className="flex items-center justify-center size-16 rounded-2xl bg-secondary/60 dark:bg-muted/50 border border-border/40 mb-5 shadow-sm [&_svg]:shrink-0">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1.5">
        {title}
      </h3>

      {description && (
        <p className="text-xs text-muted-foreground max-w-[220px] mb-5 leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="flex items-center gap-2 mt-1">
          {action}
        </div>
      )}
    </div>
  )
}
