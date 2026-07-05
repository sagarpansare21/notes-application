import { describe, it, expect, beforeEach } from 'vitest'
import { useSyncStore } from './use-sync-store'

describe('useSyncStore', () => {
  beforeEach(() => {
    useSyncStore.getState().resetSyncState()
  })

  it('should initialize with default state', () => {
    const state = useSyncStore.getState()
    expect(state.status).toBe('idle')
    expect(state.pendingCount).toBe(0)
    expect(state.lastSyncAt).toBeNull()
  })

  it('should set sync status', () => {
    useSyncStore.getState().setSyncStatus('syncing')
    expect(useSyncStore.getState().status).toBe('syncing')

    useSyncStore.getState().setSyncStatus('synced')
    expect(useSyncStore.getState().status).toBe('synced')
  })

  it('should set pending count', () => {
    useSyncStore.getState().setPendingCount(5)
    expect(useSyncStore.getState().pendingCount).toBe(5)
  })

  it('should set last sync date', () => {
    const now = new Date()
    useSyncStore.getState().setLastSyncAt(now)
    expect(useSyncStore.getState().lastSyncAt).toEqual(now)
  })

  it('should reset sync state to default', () => {
    useSyncStore.getState().setSyncStatus('error')
    useSyncStore.getState().setPendingCount(10)
    useSyncStore.getState().setLastSyncAt(new Date())

    useSyncStore.getState().resetSyncState()

    const state = useSyncStore.getState()
    expect(state.status).toBe('idle')
    expect(state.pendingCount).toBe(0)
    expect(state.lastSyncAt).toBeNull()
  })
})
