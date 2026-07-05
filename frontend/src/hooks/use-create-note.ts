import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/services/note-api'
import type { CreateNoteInput } from '@/types/note'
import { toast } from '@/components/ui/toast'

export function useCreateNote(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateNoteInput) => createNote(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })

      toast.success('Note created successfully')
      options?.onSuccess?.()
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create note'
      toast.error(message)
    },
  })
}
