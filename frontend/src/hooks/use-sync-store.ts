import { create } from 'zustand'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

export interface SyncState {
  status: SyncStatus
  pendingCount: number
  lastSyncAt: Date | null
  idMap: Record<string, string>
}

interface SyncStore extends SyncState {
  setSyncStatus: (status: SyncStatus) => void
  setPendingCount: (count: number) => void
  setLastSyncAt: (date: Date) => void
  addIdMapping: (tempId: string, realId: string) => void
  resetSyncState: () => void
}

const initialState: SyncState = {
  status: 'idle',
  pendingCount: 0,
  lastSyncAt: null,
  idMap: {},
}

export const useSyncStore = create<SyncStore>()((set) => ({
  ...initialState,
  setSyncStatus: (status) => set({ status }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
  addIdMapping: (tempId, realId) =>
    set((state) => ({
      idMap: { ...state.idMap, [tempId]: realId },
    })),
  resetSyncState: () => set(initialState),
}))
