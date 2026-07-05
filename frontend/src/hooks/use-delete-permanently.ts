import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNotePermanently } from '@/services/note-api'
import { toast } from '@/components/ui/toast'

export function useDeletePermanently() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNotePermanently(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', 'trash'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Note deleted permanently')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to delete note permanently'
      toast.error(message)
    },
  })
}
