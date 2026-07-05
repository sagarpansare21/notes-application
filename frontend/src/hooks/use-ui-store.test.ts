import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from './use-ui-store'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      isCreateNoteOpen: false,
      sidebarCollapsed: false,
      mobileOpen: false,
      darkMode: false,
    })
  })

  it('starts with default UI states', () => {
    expect(useUIStore.getState().isCreateNoteOpen).toBe(false)
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)
    expect(useUIStore.getState().mobileOpen).toBe(false)
    expect(useUIStore.getState().darkMode).toBe(false)
  })

  it('updates isCreateNoteOpen to true when openCreateNote is called', () => {
    useUIStore.getState().openCreateNote()
    expect(useUIStore.getState().isCreateNoteOpen).toBe(true)
  })

  it('updates isCreateNoteOpen to false when closeCreateNote is called', () => {
    useUIStore.getState().openCreateNote()
    expect(useUIStore.getState().isCreateNoteOpen).toBe(true)

    useUIStore.getState().closeCreateNote()
    expect(useUIStore.getState().isCreateNoteOpen).toBe(false)
  })

  it('sets isCreateNoteOpen explicitly with setCreateNoteOpen', () => {
    useUIStore.getState().setCreateNoteOpen(true)
    expect(useUIStore.getState().isCreateNoteOpen).toBe(true)

    useUIStore.getState().setCreateNoteOpen(false)
    expect(useUIStore.getState().isCreateNoteOpen).toBe(false)
  })

  it('manages sidebar toggle and set states', () => {
    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarCollapsed).toBe(true)

    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarCollapsed).toBe(false)

    useUIStore.getState().setSidebarCollapsed(true)
    expect(useUIStore.getState().sidebarCollapsed).toBe(true)
  })

  it('manages mobile sidebar toggle and set states', () => {
    useUIStore.getState().toggleMobileSidebar()
    expect(useUIStore.getState().mobileOpen).toBe(true)

    useUIStore.getState().toggleMobileSidebar()
    expect(useUIStore.getState().mobileOpen).toBe(false)

    useUIStore.getState().setMobileOpen(true)
    expect(useUIStore.getState().mobileOpen).toBe(true)
  })

  it('manages theme dark mode toggle states', () => {
    expect(useUIStore.getState().darkMode).toBe(false)

    useUIStore.getState().toggleDarkMode()
    expect(useUIStore.getState().darkMode).toBe(true)

    useUIStore.getState().toggleDarkMode()
    expect(useUIStore.getState().darkMode).toBe(false)
  })
})
