import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full max-w-[360px] group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <input
          ref={ref}
          type="text"
          className={cn(
            "w-full bg-secondary/35 dark:bg-muted/20 border border-border rounded-lg pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:bg-background focus:border-ring focus:ring-3 focus:ring-ring/25 focus:outline-none transition-all duration-150",
            className
          )}
          {...props}
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-muted-foreground/60 bg-background dark:bg-muted border border-border/80 px-1 py-0.5 rounded pointer-events-none hidden sm:inline-block">
          ⌘K
        </kbd>
      </div>
    )
  }
)
SearchBar.displayName = 'SearchBar'
