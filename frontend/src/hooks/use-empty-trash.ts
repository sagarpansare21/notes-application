import { useMutation, useQueryClient } from '@tanstack/react-query'
import { emptyTrash } from '@/services/note-api'
import { toast } from '@/components/ui/toast'

export function useEmptyTrash() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: emptyTrash,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', 'trash'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Trash emptied successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to empty trash'
      toast.error(message)
    },
  })
}
