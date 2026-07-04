import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'

export interface RecentNoteCardProps {
  title: string
  updatedAt: string
  tag?: string
  onClick?: () => void
  className?: string
}

export function RecentNoteCard({
  title,
  updatedAt,
  tag,
  onClick,
  className,
}: RecentNoteCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between py-2 border-b border-border/40 hover:bg-muted/30 px-2 rounded-lg cursor-pointer transition-all duration-150 select-none",
        className
      )}
    >
      <div className="flex flex-col text-left overflow-hidden mr-3">
        <span className="text-xs font-medium text-foreground truncate leading-snug">{title}</span>
        <span className="text-[10px] text-muted-foreground/80 mt-0.5">{updatedAt}</span>
      </div>
      {tag && (
        <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 shrink-0 select-none bg-background">
          {tag}
        </Badge>
      )}
    </div>
  )
}
