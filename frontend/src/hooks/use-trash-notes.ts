import { useQuery } from '@tanstack/react-query'
import { getTrashNotes } from '@/services/note-api'

export function useTrashNotes() {
  return useQuery({
    queryKey: ['notes', 'trash'],
    queryFn: getTrashNotes,
  })
}
