import { useState, useCallback } from 'react'
import { useUpdateNote } from '@/hooks/use-update-note'
import { EditNoteDrawer } from '@/components/presentational/notes'
import type { Note } from '@/types/note'

interface EditNoteContainerProps {
  note: Note | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditNoteContainer({ note, open, onOpenChange }: EditNoteContainerProps) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const updateMutation = useUpdateNote()

  const handleAutoSave = useCallback(
    async (data: { title: string; content: string; tags: string[] }) => {
      if (!note) return
      if (
        data.title === note.title &&
        data.content === note.content &&
        JSON.stringify(data.tags) === JSON.stringify(note.tags)
      ) return

      setAutoSaveStatus('saving')
      try {
        await updateMutation.mutateAsync({ id: note.id, data })
        setAutoSaveStatus('saved')
        setTimeout(() => setAutoSaveStatus('idle'), 2000)
      } catch {
        setAutoSaveStatus('error')
      }
    },
    [note, updateMutation]
  )

  const handleSave = useCallback(
    async (data: { title: string; content: string; tags: string[] }) => {
      if (!note) return
      setAutoSaveStatus('saving')
      try {
        await updateMutation.mutateAsync({ id: note.id, data })
        setAutoSaveStatus('saved')
        onOpenChange(false)
      } catch {
        setAutoSaveStatus('error')
      }
    },
    [note, updateMutation, onOpenChange]
  )

  return (
    <EditNoteDrawer
      open={open}
      note={note}
      onOpenChange={onOpenChange}
      onSubmit={handleSave}
      onAutoSave={handleAutoSave}
      autoSaveStatus={autoSaveStatus}
    />
  )
}
