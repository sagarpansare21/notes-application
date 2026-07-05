import { CreateNoteContainer } from '@/containers/notes/CreateNoteContainer'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Plus } from 'lucide-react'
import { useUIStore } from '@/hooks/use-ui-store'

export function NotesPage() {
  const isCreateNoteOpen = useUIStore((state) => state.isCreateNoteOpen)
  const setCreateNoteOpen = useUIStore((state) => state.setCreateNoteOpen)
  const openCreateNote = useUIStore((state) => state.openCreateNote)

  return (
    <div className="flex flex-col gap-4 text-left p-2">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Notes</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          View, organize, and construct your notes.
        </p>
      </div>

      <div className="flex items-center justify-center min-h-[320px]">
        <EmptyState
          title="No notes added"
          description="Create your first note to get started."
          action={
            <Button onClick={openCreateNote} size="sm" className="gap-1.5 cursor-pointer">
              <Plus className="size-4" />
              Add Note
            </Button>
          }
        />
      </div>

      <CreateNoteContainer open={isCreateNoteOpen} onOpenChange={setCreateNoteOpen} />
    </div>
  )
}
