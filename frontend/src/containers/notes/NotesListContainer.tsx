import { Plus, X } from 'lucide-react'
import { useNotes } from '@/hooks/use-notes'
import { useDeleteNote } from '@/hooks/use-delete-note'
import { useUIStore } from '@/hooks/use-ui-store'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { Pagination } from '@/components/ui/pagination'
import { NoteCard, NoteSkeleton } from '@/components/presentational/notes'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import type { UseNotesFiltersReturn } from '@/hooks/useNotesFilters'

interface NotesListContainerProps {
  filters: UseNotesFiltersReturn
}

export function NotesListContainer({ filters }: NotesListContainerProps) {
  const openCreateNote = useUIStore((state) => state.openCreateNote)
  const deleteMutation = useDeleteNote()

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
          title="Failed to fetch notes"
          message="There was an error communicating with the backend notes service."
          onRetry={refetch}
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
