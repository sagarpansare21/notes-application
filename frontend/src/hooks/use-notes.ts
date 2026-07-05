import { useQuery } from '@tanstack/react-query'
import { getNotes, type GetNotesParams } from '@/services/note-api'
import { upsertLocalNotes, getLocalNotes } from '@/lib/local-db'
import type { PaginatedNotes } from '@/types/note'

export function useNotes(params?: GetNotesParams) {
  return useQuery<PaginatedNotes>({
    queryKey: ['notes', params],
    queryFn: async () => {
      if (!navigator.onLine) {
        const localNotes = await getLocalNotes()
        const search = params?.search?.toLowerCase()
        const tag = params?.tag

        const filtered = localNotes.filter((n) => {
          if (search && !n.title.toLowerCase().includes(search) && !n.content.toLowerCase().includes(search)) {
            return false
          }
          if (tag && !n.tags.includes(tag)) {
            return false
          }
          return true
        })

        const limit = params?.limit ?? filtered.length
        const offset = params?.offset ?? 0
        const paginated = filtered.slice(offset, offset + limit)

        return {
          data: paginated,
          total: filtered.length,
          limit,
          offset,
        }
      }

      const result = await getNotes(params)
      upsertLocalNotes(result.data).catch(console.error)
      return result
    },
  })
}
