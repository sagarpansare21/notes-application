import { Trash as TrashIcon } from 'lucide-react'
import type { Note } from '@/types/note'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { SkeletonLine, SkeletonCircle } from '@/components/ui/skeleton'
import { TrashCard } from './TrashCard'

interface TrashGridProps {
  notes?: Note[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  onRetry: () => void
  onRestore: (id: string) => void
  onDeletePermanently: (id: string) => void
  restoringId?: string | null
  deletingId?: string | null
}

export function TrashGrid({
  notes,
  isLoading,
  isError,
  error,
  onRetry,
  onRestore,
  onDeletePermanently,
  restoringId,
  deletingId,
}: TrashGridProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
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
  )
}
