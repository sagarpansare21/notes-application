import { useMutation, useQueryClient } from '@tanstack/react-query'
import { emptyTrash } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'
import { getLocalNotes, deleteLocalNote, enqueueSync, generateSyncId } from '@/lib/local-db'

export function useEmptyTrash() {
  const queryClient = useQueryClient()

  const purgeLocalTrash = async () => {
    const localNotes = await getLocalNotes()
    for (const note of localNotes) {
      if (note.deletedAt) {
        await deleteLocalNote(note.id)
      }
    }
  }

  return useMutation({
    mutationFn: async () => {
      if (!navigator.onLine) {
        await purgeLocalTrash()
        await enqueueSync({
          id: generateSyncId(),
          type: 'empty-trash',
          createdAt: Date.now(),
        })
        return
      }
      return emptyTrash()
    },
    onSuccess: () => {
      purgeLocalTrash().catch(console.error)
      queryClient.invalidateQueries({ queryKey: ['notes', 'trash'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      if (navigator.onLine) {
        toast.success('Trash emptied successfully')
      } else {
        toast.info('Trash emptied locally. Will sync when back online.')
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to empty trash'
      toast.error(message)
    },
  })
}
