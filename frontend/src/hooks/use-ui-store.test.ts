import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from './use-ui-store'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ isCreateNoteOpen: false })
  })

  it('starts with isCreateNoteOpen as false', () => {
    expect(useUIStore.getState().isCreateNoteOpen).toBe(false)
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
})
