import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNotePermanently } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'
import { deleteLocalNote, enqueueSync, generateSyncId } from '@/lib/local-db'

export function useDeletePermanently() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!navigator.onLine) {
        await deleteLocalNote(id)
        await enqueueSync({
          id: generateSyncId(),
          type: 'delete-permanently',
          noteId: id,
          createdAt: Date.now(),
        })
        return
      }
      return deleteNotePermanently(id)
    },
    onSuccess: (_, id) => {
      deleteLocalNote(id).catch(console.error)
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
