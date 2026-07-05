import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNote } from '@/services/note-api'
import type { CreateNoteInput } from '@/types/note'
import { toast } from '@/components/ui/toast'

export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNoteInput> }) =>
      updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to save note'
      toast.error(message)
    },
  })
}
