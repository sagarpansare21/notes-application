import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNote } from '@/services/note-api'
import type { Note, CreateNoteInput, PaginatedNotes } from '@/types/note'
import { toast } from '@/components/ui/shadcn/toast'
import { upsertLocalNote, enqueueSync, generateSyncId, getLocalNote } from '@/lib/local-db'
import { useSyncStore } from './use-sync-store'

export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateNoteInput> }) => {
      const realId = useSyncStore.getState().idMap?.[id] || id
      if (!navigator.onLine) {
        // Update locally and queue for sync
        const existing = await getLocalNote(realId)
        const updatedNote: Note = existing
          ? {
            ...existing,
            ...data,
            tags: data.tags ?? existing.tags,
            updatedAt: new Date().toISOString(),
          }
          : {
            id: realId,
            title: data.title ?? '',
            content: data.content ?? '',
            tags: data.tags ?? [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        await upsertLocalNote(updatedNote)
        await enqueueSync({
          id: generateSyncId(),
          type: 'update',
          noteId: realId,
          payload: data,
          createdAt: Date.now(),
        })
        return updatedNote
      }
      return updateNote(realId, data)
    },
    onMutate: async ({ id, data }) => {
      const realId = useSyncStore.getState().idMap?.[id] || id
      await queryClient.cancelQueries({ queryKey: ['notes'] })

      const previousNotesQueries = queryClient.getQueriesData<any>({ queryKey: ['notes'] })

      // Optimistically update the note in all cached query results
      previousNotesQueries.forEach(([queryKey, oldData]) => {
        if (!oldData) return

        if (queryKey[1] === 'trash') {
          // Trash notes cache is Note[]
          const trashData = oldData as Note[]
          queryClient.setQueryData<Note[]>(queryKey,
            trashData.map((n) =>
              n.id === id || n.id === realId ? { ...n, ...data, updatedAt: new Date().toISOString() } : n
            )
          )
        } else {
          // Standard notes cache is PaginatedNotes
          const notesData = oldData as PaginatedNotes
          if (!notesData.data) return
          queryClient.setQueryData<PaginatedNotes>(queryKey, {
            ...notesData,
            data: notesData.data.map((n) =>
              n.id === id || n.id === realId ? { ...n, ...data, updatedAt: new Date().toISOString() } : n
            ),
          })
        }
      })

      return { previousNotesQueries }
    },
    onSuccess: (note) => {
      upsertLocalNote(note)
      if (!navigator.onLine) {
        toast.info('Note saved locally. Will sync when back online.')
      }
    },
    onError: (error: unknown, _variables, context) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to save note'
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
      }
    },
  })
}
