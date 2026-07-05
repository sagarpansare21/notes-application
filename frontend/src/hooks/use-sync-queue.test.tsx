import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSyncQueue } from './use-sync-queue'
import { useSyncStore } from './use-sync-store'
import { createNote, updateNote, deleteNote } from '@/services/note-api'
import {
  getSyncQueueCount,
  getAllSyncEntries,
  dequeueSyncEntry,
  getLocalNote,
  upsertLocalNote,
  deleteLocalNote,
} from '@/lib/local-db'
import { toast } from '@/components/ui/shadcn/toast'

vi.mock('@/services/note-api', () => ({
  createNote: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
  deleteNotePermanently: vi.fn(),
  restoreNote: vi.fn(),
  emptyTrash: vi.fn(),
}))

vi.mock('@/lib/local-db', () => ({
  getSyncQueueCount: vi.fn(),
  getAllSyncEntries: vi.fn(),
  dequeueSyncEntry: vi.fn(),
  getLocalNote: vi.fn(),
  upsertLocalNote: vi.fn().mockResolvedValue(undefined),
  deleteLocalNote: vi.fn().mockResolvedValue(undefined),
  getLocalNotes: vi.fn(),
}))

vi.mock('@/components/ui/shadcn/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useSyncQueue', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    useSyncStore.getState().resetSyncState()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('refreshes pending count and sets it in the store', async () => {
    vi.mocked(getSyncQueueCount).mockResolvedValue(4)

    const { result } = renderHook(() => useSyncQueue(), { wrapper })

    await act(async () => {
      await result.current.refreshPendingCount()
    })

    expect(getSyncQueueCount).toHaveBeenCalled()
    expect(useSyncStore.getState().pendingCount).toBe(4)
  })

  it('drainQueue returns early if there are no entries', async () => {
    vi.mocked(getAllSyncEntries).mockResolvedValue([])

    const { result } = renderHook(() => useSyncQueue(), { wrapper })

    await act(async () => {
      await result.current.drainQueue()
    })

    expect(useSyncStore.getState().status).toBe('idle')
    expect(createNote).not.toHaveBeenCalled()
  })

  it('drains queue successfully for create, update, delete entries', async () => {
    const mockEntries = [
      {
        id: 'sync-1',
        type: 'create' as const,
        payload: { title: 'New', content: 'New content' },
        tempId: 'optimistic-1',
        createdAt: 1000,
      },
      {
        id: 'sync-2',
        type: 'update' as const,
        noteId: 'note-2',
        payload: { content: 'Updated content' },
        createdAt: 2000,
      },
      {
        id: 'sync-3',
        type: 'delete' as const,
        noteId: 'note-3',
        createdAt: 3000,
      },
    ]

    vi.mocked(getAllSyncEntries).mockResolvedValue(mockEntries)
    vi.mocked(getSyncQueueCount).mockResolvedValue(0)

    // Mocks for processing
    const createdNote = { id: 'real-1', title: 'New', content: 'New content', tags: [], createdAt: '', updatedAt: '' }
    vi.mocked(createNote).mockResolvedValue(createdNote)
    vi.mocked(getLocalNote).mockImplementation(async (id) => {
      if (id === 'optimistic-1') {
        return { id: 'optimistic-1', title: 'New', content: 'New content', tags: [], createdAt: '', updatedAt: '' }
      }
      if (id === 'note-3') {
        return { id: 'note-3', title: 'Deleted', content: 'Deleted content', tags: [], createdAt: '', updatedAt: '' }
      }
      return undefined
    })

    const updatedNote = { id: 'note-2', title: 'Title 2', content: 'Updated content', tags: [], createdAt: '', updatedAt: '' }
    vi.mocked(updateNote).mockResolvedValue(updatedNote)

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useSyncQueue(), { wrapper })

    await act(async () => {
      await result.current.drainQueue()
    })

    // Assert API calls
    expect(createNote).toHaveBeenCalledWith({ title: 'New', content: 'New content' })
    expect(updateNote).toHaveBeenCalledWith('note-2', { content: 'Updated content' })
    expect(deleteNote).toHaveBeenCalledWith('note-3')

    // Assert DB actions
    expect(deleteLocalNote).toHaveBeenCalledWith('optimistic-1')
    expect(upsertLocalNote).toHaveBeenCalledWith(createdNote)
    expect(upsertLocalNote).toHaveBeenCalledWith(updatedNote)
    expect(upsertLocalNote).toHaveBeenCalledWith(expect.objectContaining({ id: 'note-3', deletedAt: expect.any(String) }))

    // Dequeues
    expect(dequeueSyncEntry).toHaveBeenCalledWith('sync-1')
    expect(dequeueSyncEntry).toHaveBeenCalledWith('sync-2')
    expect(dequeueSyncEntry).toHaveBeenCalledWith('sync-3')

    // Store state
    expect(useSyncStore.getState().status).toBe('synced')
    expect(useSyncStore.getState().pendingCount).toBe(0)
    expect(useSyncStore.getState().lastSyncAt).toBeInstanceOf(Date)
    expect(toast.success).toHaveBeenCalledWith('All changes synced successfully')

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tags'] })
  })

  it('handles sync errors during drain and sets status to error', async () => {
    const mockEntries = [
      {
        id: 'sync-1',
        type: 'create' as const,
        payload: { title: 'New', content: 'New content' },
        tempId: 'optimistic-1',
        createdAt: 1000,
      },
    ]

    vi.mocked(getAllSyncEntries).mockResolvedValue(mockEntries)
    vi.mocked(createNote).mockRejectedValue(new Error('Network error'))
    vi.mocked(getSyncQueueCount).mockResolvedValue(1)

    const { result } = renderHook(() => useSyncQueue(), { wrapper })

    await act(async () => {
      await result.current.drainQueue()
    })

    expect(dequeueSyncEntry).not.toHaveBeenCalled()
    expect(useSyncStore.getState().status).toBe('error')
    expect(useSyncStore.getState().pendingCount).toBe(1)
    expect(toast.error).toHaveBeenCalledWith('1 change failed to sync. Will retry later.')
  })

  it('listens to online event and drains queue', async () => {
    vi.mocked(getAllSyncEntries).mockResolvedValue([])

    const { unmount } = renderHook(() => useSyncQueue(), { wrapper })

    // Simulate online event
    await act(async () => {
      window.dispatchEvent(new Event('online'))
    })

    expect(getAllSyncEntries).toHaveBeenCalled()
    unmount()
  })

  it('listens to offline event and refreshes pending count', async () => {
    vi.mocked(getSyncQueueCount).mockResolvedValue(2)

    const { unmount } = renderHook(() => useSyncQueue(), { wrapper })

    await act(async () => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(useSyncStore.getState().pendingCount).toBe(2)
    unmount()
  })
})
