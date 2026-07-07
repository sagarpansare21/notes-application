import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/services/note-api'
import type { Note, CreateNoteInput, PaginatedNotes } from '@/types/note'
import { toast } from '@/components/ui/shadcn/toast'
import { upsertLocalNote, enqueueSync, generateSyncId } from '@/lib/local-db'

export function useCreateNote(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      if (!navigator.onLine) {
        const tempId = `optimistic-${Date.now()}`
        const tempNote: Note = {
          id: tempId,
          title: input.title,
          content: input.content,
          tags: input.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await upsertLocalNote(tempNote)
        await enqueueSync({
          id: generateSyncId(),
          type: 'create',
          payload: input,
          tempId,
          createdAt: Date.now(),
        })
        return tempNote
      }
      return createNote(input)
    },
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
    onSuccess: (note) => {
      upsertLocalNote(note)
      if (navigator.onLine) {
        toast.success('Note created successfully')
      } else {
        toast.info('Note saved locally. Will sync when back online.')
      }
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
      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ['notes'] })
        queryClient.invalidateQueries({ queryKey: ['tags'] })
      }
    },
  })
}
