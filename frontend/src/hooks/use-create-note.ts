import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/services/note-api'
import type { Note, CreateNoteInput, PaginatedNotes } from '@/types/note'
import { toast } from '@/components/ui/shadcn/toast'

export function useCreateNote(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateNoteInput) => createNote(input),
    onMutate: async (newNoteInput) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] })

      const previousNotesQueries = queryClient.getQueriesData<PaginatedNotes>({ queryKey: ['notes'] })

      const optimisticNote: Note = {
        id: `optimistic-${Date.now()}`,
        title: newNoteInput.title,
        content: newNoteInput.content,
        tags: newNoteInput.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      previousNotesQueries.forEach(([queryKey, oldData]) => {
        if (!oldData) return
        queryClient.setQueryData<PaginatedNotes>(queryKey, {
          ...oldData,
          data: [optimisticNote, ...oldData.data],
          total: oldData.total + 1,
        })
      })

      return { previousNotesQueries }
    },
    onSuccess: () => {
      toast.success('Note created successfully')
      options?.onSuccess?.()
    },
    onError: (error: unknown, _variables, context) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to create note'
      toast.error(message)

      if (context?.previousNotesQueries) {
        context.previousNotesQueries.forEach(([queryKey, oldNotes]) => {
          queryClient.setQueryData(queryKey, oldNotes)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
