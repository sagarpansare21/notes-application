import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '../../ui/drawer'
import { NoteForm } from './NoteForm'

interface CreateNoteDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (noteData: { title: string; content: string; tags: string[] }) => void
  isLoading?: boolean
}

export function CreateNoteDrawer({ open, onOpenChange, onSubmit, isLoading = false }: CreateNoteDrawerProps) {
  const [isDirty, setIsDirty] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (isLoading) return
      if (isDirty) {
        const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
        if (!confirmClose) return
      }
    }
    onOpenChange(newOpen)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-w-md sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>Create Note</DrawerTitle>
          <DrawerDescription>
            Specify a title, write body content, and assign tags to create a new note.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          <NoteForm
            onSubmit={onSubmit}
            onCancel={() => handleOpenChange(false)}
            isLoading={isLoading}
            onDirtyChange={setIsDirty}
            open={open}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
