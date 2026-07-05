import { create } from 'zustand'

interface UIState {
  isCreateNoteOpen: boolean
  openCreateNote: () => void
  closeCreateNote: () => void
  setCreateNoteOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isCreateNoteOpen: false,
  openCreateNote: () => set({ isCreateNoteOpen: true }),
  closeCreateNote: () => set({ isCreateNoteOpen: false }),
  setCreateNoteOpen: (open) => set({ isCreateNoteOpen: open }),
}))
