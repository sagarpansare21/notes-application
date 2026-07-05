import { useTrashNotes } from '@/hooks/use-trash-notes'
import { useRestoreNote } from '@/hooks/use-restore-note'
import { useDeletePermanently } from '@/hooks/use-delete-permanently'
import { TrashGrid } from '@/components/presentational/trash'

export function TrashContainer() {
  const { data: notes, isLoading, isError, error, refetch } = useTrashNotes()
  const restoreNoteMutation = useRestoreNote()
  const deletePermanentlyMutation = useDeletePermanently()

  const handleRestore = (id: string) => {
    restoreNoteMutation.mutate(id)
  }

  const handleDeletePermanently = (id: string) => {
    deletePermanentlyMutation.mutate(id)
  }

  const restoringId = restoreNoteMutation.isPending ? restoreNoteMutation.variables : null
  const deletingId = deletePermanentlyMutation.isPending ? deletePermanentlyMutation.variables : null

  return (
    <TrashGrid
      notes={notes}
      isLoading={isLoading}
      isError={isError}
      error={error as Error | null}
      onRetry={refetch}
      onRestore={handleRestore}
      onDeletePermanently={handleDeletePermanently}
      restoringId={restoringId}
      deletingId={deletingId}
    />
  )
}
