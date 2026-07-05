import { CreateNoteDrawer } from '@/components/presentational/notes'
import { useCreateNote } from '@/hooks/use-create-note'
import { useTags } from '@/hooks/use-tags'

interface CreateNoteContainerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNoteContainer({ open, onOpenChange }: CreateNoteContainerProps) {
  const { data: tags } = useTags()
  const { mutateAsync: createNote, isPending } = useCreateNote({
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  const handleCreateSubmit = async (noteData: { title: string; content: string; tags: string[] }) => {
    try {
      await createNote(noteData)
    } catch {
      // Handled globally by mutation onError Toast
    }
  }

  const availableTags = tags?.map((t) => t.name) ?? []

  return (
    <CreateNoteDrawer
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleCreateSubmit}
      isLoading={isPending}
      availableTags={availableTags}
    />
  )
}
