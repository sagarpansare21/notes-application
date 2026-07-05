import { useMutation, useQueryClient } from '@tanstack/react-query'
import { restoreNote } from '@/services/note-api'
import { toast } from '@/components/ui/toast'

export function useRestoreNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => restoreNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['notes', 'trash'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Note restored successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to restore note'
      toast.error(message)
    },
  })
}
