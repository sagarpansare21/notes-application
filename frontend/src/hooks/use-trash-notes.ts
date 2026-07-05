import { useQuery } from '@tanstack/react-query'
import { getTrashNotes } from '@/services/note-api'
import { getLocalNotes } from '@/lib/local-db'
import type { Note } from '@/types/note'

export function useTrashNotes() {
  return useQuery<Note[]>({
    queryKey: ['notes', 'trash'],
    queryFn: async () => {
      if (!navigator.onLine) {
        const localNotes = await getLocalNotes()
        return localNotes.filter((n) => n.deletedAt)
      }

      try {
        return await getTrashNotes()
      } catch (error) {
        console.warn('Failed to fetch trash notes from server, falling back to local database cache.', error)
        const localNotes = await getLocalNotes()
        return localNotes.filter((n) => n.deletedAt)
      }
    },
  })
}
