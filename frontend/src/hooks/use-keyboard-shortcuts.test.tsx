import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { useKeyboardShortcuts } from './use-keyboard-shortcuts'
import { useUIStore } from './use-ui-store'
import { useNavigate, useLocation } from 'react-router'

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}))

vi.mock('./use-ui-store', () => ({
  useUIStore: vi.fn(),
}))

function TestComponent() {
  useKeyboardShortcuts()
  return <div data-testid="shortcuts-test">Test</div>
}

describe('useKeyboardShortcuts', () => {
  const mockNavigate = vi.fn()
  const mockOpenCreateNote = vi.fn()
  const mockToggleSidebar = vi.fn()
  const mockToggleDarkMode = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.mocked(useLocation).mockReturnValue({ pathname: '/' } as any)

    vi.mocked(useUIStore).mockImplementation((selector: any) => {
      const state = {
        openCreateNote: mockOpenCreateNote,
        toggleSidebar: mockToggleSidebar,
        toggleDarkMode: mockToggleDarkMode,
      }
      return selector(state)
    })
  })

  it('registers global keydown event and handles Alt+n to trigger create note', () => {
    render(<TestComponent />)

    const event = new KeyboardEvent('keydown', {
      key: 'n',
      code: 'KeyN',
      altKey: true,
      bubbles: true,
    })
    window.dispatchEvent(event)

    expect(mockOpenCreateNote).toHaveBeenCalled()
  })

  it('handles Cmd+b or Ctrl+b to trigger toggle sidebar', () => {
    render(<TestComponent />)

    const event = new KeyboardEvent('keydown', {
      key: 'b',
      code: 'KeyB',
      metaKey: true,
      bubbles: true,
    })
    window.dispatchEvent(event)

    expect(mockToggleSidebar).toHaveBeenCalled()
  })

  it('handles Alt+t to trigger dark mode toggle', () => {
    render(<TestComponent />)

    const event = new KeyboardEvent('keydown', {
      key: 't',
      code: 'KeyT',
      altKey: true,
      bubbles: true,
    })
    window.dispatchEvent(event)

    expect(mockToggleDarkMode).toHaveBeenCalled()
  })
})
