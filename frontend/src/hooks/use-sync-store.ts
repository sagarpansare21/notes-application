import { create } from 'zustand'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

export interface SyncState {
  status: SyncStatus
  pendingCount: number
  lastSyncAt: Date | null
}

interface SyncStore extends SyncState {
  setSyncStatus: (status: SyncStatus) => void
  setPendingCount: (count: number) => void
  setLastSyncAt: (date: Date) => void
  resetSyncState: () => void
}

const initialState: SyncState = {
  status: 'idle',
  pendingCount: 0,
  lastSyncAt: null,
}

export const useSyncStore = create<SyncStore>()((set) => ({
  ...initialState,
  setSyncStatus: (status) => set({ status }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
  resetSyncState: () => set(initialState),
}))
