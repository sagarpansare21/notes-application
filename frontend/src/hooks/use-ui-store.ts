import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isCreateNoteOpen: boolean
  openCreateNote: () => void
  closeCreateNote: () => void
  setCreateNoteOpen: (open: boolean) => void

  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void

  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  toggleMobileSidebar: () => void

  darkMode: boolean
  toggleDarkMode: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isCreateNoteOpen: false,
      openCreateNote: () => set({ isCreateNoteOpen: true }),
      closeCreateNote: () => set({ isCreateNoteOpen: false }),
      setCreateNoteOpen: (open) => set({ isCreateNoteOpen: open }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      mobileOpen: false,
      setMobileOpen: (open) => set({ mobileOpen: open }),
      toggleMobileSidebar: () => set((state) => ({ mobileOpen: !state.mobileOpen })),

      darkMode: typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'notes-app-ui-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
