import { Plus, X } from 'lucide-react'
import { useNotes } from '@/hooks/use-notes'
import { useDeleteNote } from '@/hooks/use-delete-note'
import { useUIStore } from '@/hooks/use-ui-store'
import { useOfflineStatus } from '@/hooks/use-offline-status'
import { Button } from '@/components/ui/shadcn/button'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Pagination } from '@/components/shared/pagination'
import { NoteCard, NoteSkeleton } from '@/components/presentational/notes'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import type { UseNotesFiltersReturn } from '@/hooks/useNotesFilters'

interface NotesListContainerProps {
  filters: UseNotesFiltersReturn
  onEdit: (note: Note) => void
}

export function NotesListContainer({ filters, onEdit }: NotesListContainerProps) {
  const openCreateNote = useUIStore((state) => state.openCreateNote)
  const deleteMutation = useDeleteNote()
  const isOffline = useOfflineStatus()

  const offset = (filters.page - 1) * filters.limit

  const {
    data: paginatedNotes,
    isLoading,
    isError,
    refetch,
  } = useNotes({
    search: filters.search,
    tag: filters.selectedTag,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    limit: filters.limit,
    offset,
  })

  const notes = paginatedNotes?.data ?? []
  const total = paginatedNotes?.total ?? 0
  const totalPages = Math.ceil(total / filters.limit)

  if (isLoading) {
    return (
      <div
        className={cn(
          filters.viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2'
            : 'flex flex-col gap-3 mt-2'
        )}
      >
        {Array.from({ length: filters.limit }).map((_, idx) => (
          <NoteSkeleton key={idx} viewMode={filters.viewMode} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <ErrorState
          variant={isOffline ? 'offline' : 'error'}
          title={isOffline ? "You're offline" : 'Failed to fetch notes'}
          message={
            isOffline
              ? 'Connect to the internet to load and sync your notes.'
              : 'There was an error communicating with the backend notes service.'
          }
          onRetry={isOffline ? undefined : refetch}
        />
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        {filters.isFiltered ? (
          <EmptyState
            title="No matching notes found"
            description="Your filters returned no results. Try clearing them to see all notes."
            action={
              <Button
                onClick={filters.clearFilters}
                size="sm"
                variant="outline"
                className="gap-1.5 cursor-pointer text-xs"
              >
                <X className="size-3.5" />
                Clear Filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No notes added"
            description="Create your first note to get started."
            action={
              <Button
                onClick={openCreateNote}
                size="sm"
                className="gap-1.5 cursor-pointer text-xs"
              >
                <Plus className="size-3.5" />
                Add Note
              </Button>
            }
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          filters.viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2'
            : 'flex flex-col gap-3 mt-2'
        )}
      >
        {notes.map((note: Note) => (
          <NoteCard
            key={note.id}
            note={note}
            viewMode={filters.viewMode}
            onDelete={(id) => deleteMutation.mutate(id)}
            onEdit={onEdit}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          {total} {total === 1 ? 'note' : 'notes'} total
        </p>
        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={filters.setPage}
        />
      </div>
    </div>
  )
}
