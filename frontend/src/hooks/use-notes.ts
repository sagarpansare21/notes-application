import { useQuery } from '@tanstack/react-query'
import { getNotes, type GetNotesParams } from '@/services/note-api'

export function useNotes(params?: GetNotesParams) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => getNotes(params),
  })
}
