import { MoreHorizontal, Trash, Clock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown'
import { Card } from '@/components/ui/card'
import type { Note } from '@/types/note'
import { getMarkdownPreview, formatRelativeTime } from '@/lib/utils'

interface NoteCardProps {
  note: Note
  viewMode: 'grid' | 'list'
  onDelete: (id: string) => void
}

export function NoteCard({ note, viewMode, onDelete }: NoteCardProps) {
  const plainTextPreview = getMarkdownPreview(note.content, viewMode === 'list' ? 80 : 120)
  const relativeTime = formatRelativeTime(note.updatedAt)

  if (viewMode === 'list') {
    return (
      <Card
        hoverable
        className="flex items-center justify-between gap-4 p-3 border border-border bg-card hover:border-ring/30 select-none cursor-default group"
      >
        <div className="flex flex-1 items-center min-w-0 gap-3">
          <h3 className="font-semibold text-xs text-foreground tracking-tight truncate w-1/4 shrink-0">
            {note.title}
          </h3>
          <p className="text-xs text-muted-foreground/80 truncate flex-1 leading-relaxed">
            {plainTextPreview || <span className="italic opacity-60">No content</span>}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 max-w-[200px] overflow-hidden">
          {note.tags && note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md select-none shrink-0 border border-border/30 hover:bg-muted/90 transition-colors duration-150"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0 select-none">
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
            <Clock className="size-3 opacity-60" />
            {relativeTime}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(triggerProps) => (
                <button
                  {...triggerProps}
                  type="button"
                  className="inline-flex items-center justify-center size-6 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="size-3.5" />
                </button>
              )}
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDelete(note.id)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive gap-1.5 cursor-pointer"
              >
                <Trash className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    )
  }

  return (
    <Card
      hoverable
      className="flex flex-col justify-between p-4.5 border border-border bg-card hover:border-ring/30 select-none cursor-default min-h-[140px] gap-3 text-left relative group"
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-xs text-foreground tracking-tight truncate flex-1">
            {note.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(triggerProps) => (
                <button
                  {...triggerProps}
                  type="button"
                  className="inline-flex items-center justify-center size-5.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-opacity opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <MoreHorizontal className="size-3.5" />
                </button>
              )}
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDelete(note.id)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive gap-1.5 cursor-pointer"
              >
                <Trash className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-3 break-words h-[54px] overflow-hidden">
          {plainTextPreview || <span className="italic opacity-60">No content</span>}
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex flex-wrap items-center gap-1 overflow-hidden h-[18px]">
          {note.tags && note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md select-none shrink-0 border border-border/30 hover:bg-muted/90 transition-colors duration-150"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border/30 pt-2 text-[10px] text-muted-foreground select-none">
          <span className="inline-flex items-center gap-1 font-medium">
            <Clock className="size-3 opacity-60" />
            {relativeTime}
          </span>
        </div>
      </div>
    </Card>
  )
}
