import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getNotes, type GetNotesParams } from '@/services/note-api'
import { upsertLocalNotes, getLocalNotes } from '@/lib/local-db'
import type { PaginatedNotes } from '@/types/note'

async function getLocalNotesResponse(
  params?: GetNotesParams
): Promise<PaginatedNotes> {
  const localNotes = await getLocalNotes()

  const search = params?.search?.toLowerCase()
  const tag = params?.tag

  const filtered = localNotes.filter((note) => {
    const title = note.title ?? ''
    const content = note.content ?? ''
    const tags = note.tags ?? []
    if (
      search &&
      !title.toLowerCase().includes(search) &&
      !content.toLowerCase().includes(search)
    ) {
      return false
    }

    if (tag && !tags.includes(tag)) {
      return false
    }

    return true
  })

  const limit = params?.limit ?? filtered.length
  const offset = params?.offset ?? 0

  return {
    data: filtered.slice(offset, offset + limit),
    total: filtered.length,
    limit,
    offset,
  }
}

export function useNotes(params?: GetNotesParams) {
  return useQuery<PaginatedNotes>({
    queryKey: ['notes', params],
    queryFn: async () => {
      // Offline: serve data directly from IndexedDB
      if (!navigator.onLine) {
        return getLocalNotesResponse(params)
      }

      try {
        const result = await getNotes(params)
        // Update local cache in the background
        void upsertLocalNotes(result.data)
        return result
      } catch (error) {
        // Server returned an HTTP error (400/404/500)
        if (axios.isAxiosError(error) && error.response) {
          throw error
        }
        // Network failure, timeout, DNS issue, etc.
        console.warn(
          'Failed to fetch notes from server, falling back to local cache.',
          error
        )
        return getLocalNotesResponse(params)
      }
    },
  })
}