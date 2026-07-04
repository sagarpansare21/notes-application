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
  icon = <FileText className="size-8 text-muted-foreground/60" />,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-border bg-card/30 rounded-xl max-w-md mx-auto w-full shadow-notion',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center size-14 rounded-full bg-secondary dark:bg-muted mb-4 shrink-0 shadow-sm border border-border/50 [&_svg]:shrink-0">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mb-5 leading-normal">{description}</p>
      )}
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
