import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'
import { getLocalNote, upsertLocalNote, enqueueSync, generateSyncId } from '@/lib/local-db'
import type { PaginatedNotes, Note } from '@/types/note'
import { useSyncStore } from './use-sync-store'

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const realId = useSyncStore.getState().idMap?.[id] || id
      if (!navigator.onLine) {
        const note = await getLocalNote(realId)
        if (note) {
          note.deletedAt = new Date().toISOString()
          await upsertLocalNote(note)
        }
        await enqueueSync({
          id: generateSyncId(),
          type: 'delete',
          noteId: realId,
          createdAt: Date.now(),
        })
        return
      }
      return deleteNote(realId)
    },
    onMutate: async (id) => {
      const realId = useSyncStore.getState().idMap?.[id] || id
      await queryClient.cancelQueries({ queryKey: ['notes'] })

      const previousNotesQueries = queryClient.getQueriesData<any>({ queryKey: ['notes'] })

      previousNotesQueries.forEach(([queryKey, oldData]) => {
        if (!oldData) return

        if (queryKey[1] === 'trash') {
          const trashData = oldData as Note[]
          queryClient.setQueryData<Note[]>(queryKey,
            trashData.filter((n) => n.id !== id && n.id !== realId)
          )
        } else {
          const notesData = oldData as PaginatedNotes
          if (!notesData.data) return
          queryClient.setQueryData<PaginatedNotes>(queryKey, {
            ...notesData,
            data: notesData.data.filter((n) => n.id !== id && n.id !== realId),
            total: Math.max(0, notesData.total - 1),
          })
        }
      })

      return { previousNotesQueries }
    },
    onSuccess: (_, id) => {
      const realId = useSyncStore.getState().idMap?.[id] || id
      // Soft delete: update deletedAt in localDb
      getLocalNote(realId).then((note) => {
        if (note) {
          note.deletedAt = new Date().toISOString()
          upsertLocalNote(note).catch(console.error)
        }
      }).catch(console.error)

      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ['notes'] })
        queryClient.invalidateQueries({ queryKey: ['tags'] })
        toast.success('Note moved to trash')
      } else {
        toast.info('Note moved to trash locally. Will sync when back online.')
      }
    },
    onError: (error: unknown, _id, context) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to delete note'
      toast.error(message)

      if (context?.previousNotesQueries) {
        context.previousNotesQueries.forEach(([queryKey, oldNotes]) => {
          queryClient.setQueryData(queryKey, oldNotes)
        })
      }
    },
  })
}
