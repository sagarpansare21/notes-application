import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Note, CreateNoteInput } from '@/types/note'

export type SyncQueueEntry =
  | {
    id: string
    type: 'create'
    payload: CreateNoteInput
    tempId: string
    createdAt: number
  }
  | {
    id: string
    type: 'update'
    noteId: string
    payload: Partial<CreateNoteInput>
    createdAt: number
  }
  | {
    id: string
    type: 'delete'
    noteId: string
    createdAt: number
  }
  | {
    id: string
    type: 'delete-permanently'
    noteId: string
    createdAt: number
  }
  | {
    id: string
    type: 'restore'
    noteId: string
    createdAt: number
  }
  | {
    id: string
    type: 'empty-trash'
    createdAt: number
  }

interface NotesDB extends DBSchema {
  notes: {
    key: string
    value: Note
    indexes: { 'by-updatedAt': string }
  }
  'sync-queue': {
    key: string
    value: SyncQueueEntry
    indexes: { 'by-createdAt': number }
  }
}

let db: IDBPDatabase<NotesDB> | null = null

export async function getDB(): Promise<IDBPDatabase<NotesDB>> {
  if (db) return db
  db = await openDB<NotesDB>('notes-app', 1, {
    upgrade(database) {
      // Notes store
      if (!database.objectStoreNames.contains('notes')) {
        const notesStore = database.createObjectStore('notes', { keyPath: 'id' })
        notesStore.createIndex('by-updatedAt', 'updatedAt')
      }

      // Sync queue store
      if (!database.objectStoreNames.contains('sync-queue')) {
        const queueStore = database.createObjectStore('sync-queue', { keyPath: 'id' })
        queueStore.createIndex('by-createdAt', 'createdAt')
      }
    },
  })
  return db
}

export async function upsertLocalNote(note: Note): Promise<void> {
  const db = await getDB()
  await db.put('notes', note)
}

export async function upsertLocalNotes(notes: Note[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('notes', 'readwrite')
  await Promise.all([...notes.map((n) => tx.store.put(n)), tx.done])
}

export async function getLocalNotes(): Promise<Note[]> {
  const db = await getDB()
  const all = await db.getAll('notes')
  return all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export async function getLocalNote(id: string): Promise<Note | undefined> {
  const db = await getDB()
  return db.get('notes', id)
}

export async function deleteLocalNote(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('notes', id)
}

export async function clearLocalNotes(): Promise<void> {
  const db = await getDB()
  await db.clear('notes')
}

export async function enqueueSync(entry: SyncQueueEntry): Promise<void> {
  const db = await getDB()
  await db.put('sync-queue', entry)
}

export async function dequeueSyncEntry(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('sync-queue', id)
}

export async function getAllSyncEntries(): Promise<SyncQueueEntry[]> {
  const db = await getDB()
  return db.getAllFromIndex('sync-queue', 'by-createdAt')
}

export async function getSyncQueueCount(): Promise<number> {
  const db = await getDB()
  return db.count('sync-queue')
}

export async function clearSyncQueue(): Promise<void> {
  const db = await getDB()
  await db.clear('sync-queue')
}

export function generateSyncId(): string {
  return `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
