import { CreateNoteDrawer } from '@/components/presentational/notes'
import { useCreateNote } from '@/hooks/use-create-note'

interface CreateNoteContainerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNoteContainer({ open, onOpenChange }: CreateNoteContainerProps) {
  const { mutateAsync: createNote, isPending } = useCreateNote({
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  const handleCreateSubmit = async (noteData: { title: string; content: string; tags: string[] }) => {
    try {
      await createNote(noteData)
    } catch (err) {
      // Handled globally by mutation onError Toast
    }
  }

  return (
    <CreateNoteDrawer
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleCreateSubmit}
      isLoading={isPending}
    />
  )
}
