import React from 'react'
import { AlertCircle, RefreshCcw, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/shadcn/button'

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
  retryText?: string
  variant?: 'error' | 'offline'
}

export function ErrorState({
  className,
  title,
  message,
  onRetry,
  retryText = 'Try again',
  variant = 'error',
  ...props
}: ErrorStateProps) {
  const isOffline = variant === 'offline'

  const defaultTitle = isOffline ? 'You\'re offline' : 'Something went wrong'
  const icon = isOffline
    ? <WifiOff className="size-6" />
    : <AlertCircle className="size-6" />

  const iconClasses = isOffline
    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    : 'bg-destructive/10 text-destructive border-destructive/20'

  const containerClasses = isOffline
    ? 'border-amber-500/15 bg-amber-500/5 dark:bg-amber-500/10'
    : 'border-destructive/15 bg-destructive/5 dark:bg-destructive/10'

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-10',
        'border rounded-2xl max-w-sm mx-auto w-full',
        containerClasses,
        className
      )}
      {...props}
    >
      <div className={cn(
        'flex items-center justify-center size-14 rounded-2xl mb-5 border shadow-sm [&_svg]:shrink-0',
        iconClasses
      )}>
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1.5">
        {title ?? defaultTitle}
      </h3>

      <p className="text-xs text-muted-foreground max-w-[220px] mb-5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-1.5"
        >
          <RefreshCcw className="size-3" />
          {retryText}
        </Button>
      )}
    </div>
  )
}
