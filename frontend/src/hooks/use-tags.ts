import { useQuery } from '@tanstack/react-query'
import { getTags } from '@/services/note-api'

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })
}
