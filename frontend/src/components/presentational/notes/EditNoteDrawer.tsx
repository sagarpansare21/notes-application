import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/shadcn/drawer'
import { NoteForm } from './NoteForm'
import type { Note } from '@/types/note'

interface EditNoteDrawerProps {
  open: boolean
  note: Note | null
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { title: string; content: string; tags: string[] }) => void
  onAutoSave: (data: { title: string; content: string; tags: string[] }) => void
  autoSaveStatus?: 'idle' | 'saving' | 'saved' | 'error'
  availableTags?: string[]
}

export function EditNoteDrawer({
  open,
  note,
  onOpenChange,
  onSubmit,
  onAutoSave,
  autoSaveStatus = 'idle',
  availableTags = [],
}: EditNoteDrawerProps) {
  if (!note) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Edit Note</DrawerTitle>
          <DrawerDescription>
            Changes are saved automatically as you type.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          <NoteForm
            key={note.id}
            mode="edit"
            initialValues={{
              title: note.title,
              content: note.content,
              tags: note.tags,
            }}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            onAutoSave={onAutoSave}
            autoSaveStatus={autoSaveStatus}
            availableTags={availableTags}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
