import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNotePermanently } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'
import { deleteLocalNote, enqueueSync, generateSyncId } from '@/lib/local-db'
import { useSyncStore } from './use-sync-store'

export function useDeletePermanently() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const realId = useSyncStore.getState().idMap[id] || id
      if (!navigator.onLine) {
        await deleteLocalNote(realId)
        await enqueueSync({
          id: generateSyncId(),
          type: 'delete-permanently',
          noteId: realId,
          createdAt: Date.now(),
        })
        return
      }
      return deleteNotePermanently(realId)
    },
    onSuccess: (_, id) => {
      const realId = useSyncStore.getState().idMap[id] || id
      deleteLocalNote(realId).catch(console.error)
      queryClient.invalidateQueries({ queryKey: ['notes', 'trash'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      if (navigator.onLine) {
        toast.success('Note deleted permanently')
      } else {
        toast.info('Note deleted permanently locally. Will sync when back online.')
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to delete note permanently'
      toast.error(message)
    },
  })
}
