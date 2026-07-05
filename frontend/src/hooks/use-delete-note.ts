import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote } from '@/services/note-api'
import { toast } from '@/components/ui/toast'

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Note moved to trash')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to delete note'
      toast.error(message)
    },
  })
}
