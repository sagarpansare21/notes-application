import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
  retryText?: string
}

export function ErrorState({
  className,
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try again',
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-destructive/15 bg-destructive/5 dark:bg-destructive/10 rounded-xl max-w-md mx-auto w-full shadow-notion',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center size-12 rounded-full bg-destructive/10 text-destructive mb-4 shrink-0 shadow-sm border border-destructive/20 [&_svg]:shrink-0">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-5 leading-normal">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  )
}
