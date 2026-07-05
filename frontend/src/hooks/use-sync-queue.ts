import { useCallback, useEffect } from 'react'
import {
  getAllSyncEntries,
  dequeueSyncEntry,
  getSyncQueueCount,
  getLocalNote,
  upsertLocalNote,
  deleteLocalNote,
  getLocalNotes,
} from '@/lib/local-db'
import type { SyncQueueEntry } from '@/lib/local-db'
import {
  createNote,
  updateNote,
  deleteNote,
  deleteNotePermanently,
  restoreNote,
  emptyTrash,
} from '@/services/note-api'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/shadcn/toast'
import { useSyncStore } from './use-sync-store'

async function processSyncEntry(entry: SyncQueueEntry): Promise<void> {
  switch (entry.type) {
    case 'create': {
      const created = await createNote(entry.payload)
      const tempNote = await getLocalNote(entry.tempId)
      if (tempNote) await deleteLocalNote(entry.tempId)
      await upsertLocalNote(created)
      break
    }
    case 'update': {
      const updated = await updateNote(entry.noteId, entry.payload)
      await upsertLocalNote(updated)
      break
    }
    case 'delete': {
      await deleteNote(entry.noteId)
      const note = await getLocalNote(entry.noteId)
      if (note) {
        note.deletedAt = new Date().toISOString()
        await upsertLocalNote(note)
      }
      break
    }
    case 'delete-permanently': {
      await deleteNotePermanently(entry.noteId)
      await deleteLocalNote(entry.noteId)
      break
    }
    case 'restore': {
      await restoreNote(entry.noteId)
      const note = await getLocalNote(entry.noteId)
      if (note) {
        note.deletedAt = null
        await upsertLocalNote(note)
      }
      break
    }
    case 'empty-trash': {
      await emptyTrash()
      const localNotes = await getLocalNotes()
      for (const note of localNotes) {
        if (note.deletedAt) {
          await deleteLocalNote(note.id)
        }
      }
      break
    }
  }
}

export function useSyncQueue() {
  const queryClient = useQueryClient()
  const { setSyncStatus, setPendingCount, setLastSyncAt } = useSyncStore()

  const refreshPendingCount = useCallback(async () => {
    const count = await getSyncQueueCount()
    setPendingCount(count)
  }, [setPendingCount])

  const drainQueue = useCallback(async () => {
    const entries = await getAllSyncEntries()
    if (entries.length === 0) return

    setSyncStatus('syncing')

    let failed = 0
    for (const entry of entries) {
      try {
        await processSyncEntry(entry)
        await dequeueSyncEntry(entry.id)
      } catch {
        failed++
      }
    }

    await queryClient.invalidateQueries({ queryKey: ['notes'] })
    await queryClient.invalidateQueries({ queryKey: ['tags'] })

    const remaining = await getSyncQueueCount()
    setPendingCount(remaining)
    setLastSyncAt(new Date())
    setSyncStatus(failed > 0 ? 'error' : 'synced')

    if (failed > 0) {
      toast.error(`${failed} change${failed > 1 ? 's' : ''} failed to sync. Will retry later.`)
    } else {
      toast.success('All changes synced successfully')
    }
  }, [queryClient, setSyncStatus, setPendingCount, setLastSyncAt])

  useEffect(() => {
    const handleOnline = () => drainQueue()
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [drainQueue])

  useEffect(() => {
    refreshPendingCount()
    const handleOffline = () => refreshPendingCount()
    window.addEventListener('offline', handleOffline)
    return () => window.removeEventListener('offline', handleOffline)
  }, [refreshPendingCount])

  return { drainQueue, refreshPendingCount }
}
