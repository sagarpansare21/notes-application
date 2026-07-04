import { Calendar, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { TagList } from './tag-list'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export interface NoteCardProps {
  title: string
  content: string
  tags: string[]
  updatedAt: string
  selected?: boolean
  onClick?: () => void
  onDelete?: () => void
  className?: string
}

export function NoteCard({
  title,
  content,
  tags,
  updatedAt,
  selected = false,
  onClick,
  onDelete,
  className,
}: NoteCardProps) {
  return (
    <Card
      hoverable
      selected={selected}
      onClick={onClick}
      className={cn("cursor-pointer select-none group relative overflow-hidden transition-all duration-200", className)}
    >
      <CardHeader className="pb-2 pr-10">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xs font-semibold text-foreground line-clamp-1 leading-snug">
            {title}
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed mt-1">
          {content}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 flex flex-col gap-3">
        {tags.length > 0 && (
          <TagList tags={tags} className="pointer-events-none" />
        )}
        <div className="flex items-center justify-between text-[9px] text-muted-foreground/80 mt-1">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{updatedAt}</span>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-muted-foreground hover:text-destructive size-6 hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              aria-label="Delete note"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
