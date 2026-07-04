import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  helperText?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const defaultId = React.useId()
    const textareaId = id || defaultId
    const errorId = `${textareaId}-error`
    const helperId = `${textareaId}-helper`

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-muted-foreground select-none"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all duration-150 ease-in-out placeholder:text-muted-foreground outline-none shadow-sm shadow-black/5 hover:border-muted-foreground/30 focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-y',
            error &&
              'border-destructive focus:border-destructive focus:ring-destructive/20 hover:border-destructive',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-destructive font-medium leading-none">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-muted-foreground leading-none">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
