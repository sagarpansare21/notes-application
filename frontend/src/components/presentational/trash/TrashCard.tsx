import { useState } from 'react'
import { RotateCcw, Trash2, Clock, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/shadcn/card'
import { Button } from '@/components/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/shadcn/dialog'
import type { Note } from '@/types/note'
import { getMarkdownPreview, formatRelativeTime } from '@/lib/utils'

interface TrashCardProps {
  note: Note
  onRestore: (id: string) => void
  onDeletePermanently: (id: string) => void
  isRestoring?: boolean
  isDeleting?: boolean
}

export function TrashCard({
  note,
  onRestore,
  onDeletePermanently,
  isRestoring = false,
  isDeleting = false,
}: TrashCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const plainTextPreview = getMarkdownPreview(note.content, 120)
  const relativeTime = formatRelativeTime(note.updatedAt)

  const handleDeleteClick = () => {
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    setIsConfirmOpen(false)
    onDeletePermanently(note.id)
  }

  return (
    <>
      <Card
        className="flex flex-col justify-between p-5 border border-border/80 bg-card hover:border-ring/30 select-none cursor-default min-h-[160px] gap-4 text-left relative group animate-in fade-in duration-200"
      >
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-xs text-foreground tracking-tight truncate flex-1">
              {note.title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground/80 line-clamp-3 leading-relaxed break-words pr-1">
            {plainTextPreview || <span className="italic opacity-60">No content</span>}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-auto">
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-medium select-none">
            <Clock className="size-3 opacity-60" />
            {relativeTime}
          </span>

          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              className="size-7 p-0 shrink-0 cursor-pointer"
              title="Restore Note"
              disabled={isRestoring || isDeleting}
              loading={isRestoring}
              onClick={() => onRestore(note.id)}
            >
              <RotateCcw className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="size-7 p-0 hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer border-border"
              title="Delete Permanently"
              disabled={isRestoring || isDeleting}
              loading={isDeleting}
              onClick={handleDeleteClick}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Custom Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="flex flex-row items-start gap-3 text-left">
            <div className="flex items-center justify-center size-9 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive shrink-0 mt-0.5">
              <AlertTriangle className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-sm font-bold text-foreground">
                Delete Note Permanently?
              </DialogTitle>
              <DialogDescription className="text-xs mt-1 text-muted-foreground leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-foreground font-semibold">&ldquo;{note.title}&rdquo;</strong>? This action is permanent and cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs"
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
