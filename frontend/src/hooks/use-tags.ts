import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getTags } from '@/services/note-api'
import { getLocalNotes } from '@/lib/local-db'
import type { Tag } from '@/types/note'

async function getLocalTagsResponse(): Promise<Tag[]> {
  const localNotes = await getLocalNotes()
  
  // Exclude deleted notes
  const activeNotes = localNotes.filter(n => !n.deletedAt)
  
  const tagCounts: Record<string, number> = {}
  activeNotes.forEach((note) => {
    const tags = note.tags || []
    tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.keys(tagCounts).map((tagName, idx) => ({
    id: `tag-${tagName}-${idx}`,
    name: tagName,
    noteCount: tagCounts[tagName],
  }))
}

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      if (!navigator.onLine) {
        return getLocalTagsResponse()
      }

      try {
        return await getTags()
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw error
        }
        console.warn('Failed to fetch tags from server, falling back to local database calculation.', error)
        return getLocalTagsResponse()
      }
    },
  })
}
