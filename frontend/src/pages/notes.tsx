import { useUIStore } from '@/hooks/use-ui-store'
import { useNotesFilters } from '@/hooks/useNotesFilters'
import {
  NotesToolbarContainer,
  NotesListContainer,
  CreateNoteContainer,
} from '@/containers/notes'

export function NotesPage() {
  const isCreateNoteOpen = useUIStore((state) => state.isCreateNoteOpen)
  const setCreateNoteOpen = useUIStore((state) => state.setCreateNoteOpen)
  const filters = useNotesFilters()

  return (
    <div className="flex flex-col gap-4 text-left p-2 h-full">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Notes</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium leading-normal">
          View, organize, and construct your notes.
        </p>
      </div>

      <NotesToolbarContainer filters={filters} />

      <div className="flex-1 overflow-y-auto">
        <NotesListContainer filters={filters} />
      </div>

      <CreateNoteContainer open={isCreateNoteOpen} onOpenChange={setCreateNoteOpen} />
    </div>
  )
}
