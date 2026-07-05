import { useMutation, useQueryClient } from '@tanstack/react-query'
import { restoreNote } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'
import { getLocalNote, upsertLocalNote, enqueueSync, generateSyncId } from '@/lib/local-db'

export function useRestoreNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!navigator.onLine) {
        const note = await getLocalNote(id)
        if (note) {
          note.deletedAt = null
          await upsertLocalNote(note)
        }
        await enqueueSync({
          id: generateSyncId(),
          type: 'restore',
          noteId: id,
          createdAt: Date.now(),
        })
        return
      }
      return restoreNote(id)
    },
    onSuccess: (_, id) => {
      getLocalNote(id).then((note) => {
        if (note) {
          note.deletedAt = null
          upsertLocalNote(note).catch(console.error)
        }
      }).catch(console.error)

      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['notes', 'trash'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })

      if (navigator.onLine) {
        toast.success('Note restored successfully')
      } else {
        toast.info('Note restored locally. Will sync when back online.')
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to restore note'
      toast.error(message)
    },
  })
}
