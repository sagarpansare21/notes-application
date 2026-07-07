import { useMutation, useQueryClient } from '@tanstack/react-query'
import { importNotes } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'

export function useImportNotes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => importNotes(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success(
        `Import completed. Imported: ${data.imported}, Skipped: ${data.skipped}, Failed: ${data.failed}`
      )
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err.response?.data?.message || 'Failed to import notes'
      toast.error(message)
    },
  })
}
