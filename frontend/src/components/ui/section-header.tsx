import React from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
  bordered?: boolean
}

export function SectionHeader({
  className,
  title,
  description,
  actions,
  bordered = false,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 w-full',
        bordered && 'border-b border-border/80',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1 text-left">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground leading-normal">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:self-center self-start shrink-0">{actions}</div>
      )}
    </div>
  )
}
