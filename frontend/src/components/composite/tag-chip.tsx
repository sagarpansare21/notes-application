import { X } from 'lucide-react'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'

export interface TagChipProps {
  label: string
  onRemove?: () => void
  active?: boolean
  className?: string
  onClick?: () => void
}

export function TagChip({ label, onRemove, active = false, className, onClick }: TagChipProps) {
  return (
    <Badge
      variant={active ? 'default' : 'outline'}
      onClick={onClick}
      className={cn(
        "gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full text-[10px] font-medium transition-all select-none cursor-pointer",
        !active && "hover:bg-secondary border-border/80 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "rounded-full p-0.5 hover:bg-muted text-current opacity-60 hover:opacity-100 focus:outline-none size-4 flex items-center justify-center shrink-0",
            active && "hover:bg-primary-foreground/10"
          )}
          aria-label={`Remove ${label} tag`}
        >
          <X className="size-2.5" />
        </button>
      )}
    </Badge>
  )
}
