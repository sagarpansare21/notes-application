import { useState } from 'react'
import { Trash as TrashIcon, Trash2, AlertTriangle } from 'lucide-react'
import type { Note } from '@/types/note'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { SkeletonLine, SkeletonCircle } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { TrashCard } from './TrashCard'

interface TrashGridProps {
  notes?: Note[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  onRetry: () => void
  onRestore: (id: string) => void
  onDeletePermanently: (id: string) => void
  onEmptyTrash: () => void
  restoringId?: string | null
  deletingId?: string | null
  isEmptying?: boolean
}

export function TrashGrid({
  notes,
  isLoading,
  isError,
  error,
  onRetry,
  onRestore,
  onDeletePermanently,
  onEmptyTrash,
  restoringId,
  deletingId,
  isEmptying = false,
}: TrashGridProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleEmptyTrashConfirm = () => {
    setIsConfirmOpen(false)
    onEmptyTrash()
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5 flex flex-col gap-4 min-h-[160px]" data-testid="trash-skeleton-card">
            <div className="flex flex-col gap-2.5">
              <SkeletonLine height="h-4" width="w-2/3" />
              <SkeletonLine height="h-3.5" width="w-full" />
              <SkeletonLine height="h-3.5" width="w-11/12" />
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-auto">
              <SkeletonLine height="h-3" width="w-16" />
              <div className="flex gap-1.5">
                <SkeletonCircle size="size-7" />
                <SkeletonCircle size="size-7" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <ErrorState message={error?.message || 'Failed to load deleted notes'} onRetry={onRetry} />
      </div>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <EmptyState
          icon={<TrashIcon className="size-6 text-muted-foreground/60" />}
          title="Trash is empty"
          description="Notes you delete will appear here, ready to be restored or deleted permanently."
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Empty Trash Action Bar */}
      <div className="flex items-center justify-between gap-4 bg-muted/30 border border-border/40 px-4 py-2.5 rounded-xl text-left select-none animate-in fade-in duration-200">
        <span className="text-[11px] text-muted-foreground font-semibold">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'} found in trash
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3 text-xs font-semibold cursor-pointer border-border/60 shrink-0"
          onClick={() => setIsConfirmOpen(true)}
          disabled={isEmptying}
          loading={isEmptying}
        >
          <Trash2 className="size-3.5 mr-1.5" />
          Empty Trash
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <TrashCard
            key={note.id}
            note={note}
            onRestore={onRestore}
            onDeletePermanently={onDeletePermanently}
            isRestoring={restoringId === note.id}
            isDeleting={deletingId === note.id}
          />
        ))}
      </div>

      {/* Empty Trash Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="flex flex-row items-start gap-3 text-left">
            <div className="flex items-center justify-center size-9 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive shrink-0 mt-0.5">
              <AlertTriangle className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-sm font-bold text-foreground">
                Empty Trash Permanently?
              </DialogTitle>
              <DialogDescription className="text-xs mt-1 text-muted-foreground leading-relaxed">
                Are you sure you want to permanently delete all <strong className="text-foreground font-semibold">{notes.length}</strong> items in the trash? This action cannot be undone.
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
              onClick={handleEmptyTrashConfirm}
            >
              Empty Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
