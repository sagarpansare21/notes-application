import { useEffect } from 'react'
import { useUIStore } from './use-ui-store'
import { useNavigate, useLocation } from 'react-router'

export function useKeyboardShortcuts() {
  const openCreateNote = useUIStore((state) => state.openCreateNote)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Focus search input (Cmd+K, Ctrl+K, or '/')
      const isSearchKey = (e.metaKey || e.ctrlKey) && e.code === 'KeyK'
      const isSlashKey = e.code === 'Slash'

      const activeElement = document.activeElement
      const isEditing = 
        activeElement && (
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' || 
          activeElement.getAttribute('contenteditable') === 'true'
        )

      if (isSearchKey || (isSlashKey && !isEditing)) {
        e.preventDefault()
        // Prioritize focusing the main notes filter search, fall back to header search
        const searchInput = (
          document.getElementById('notes-search-input') ||
          document.getElementById('header-search-input')
        ) as HTMLInputElement
        
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
        return
      }

      // If user is editing/typing in any input, don't trigger global shortcuts
      if (isEditing) return

      // 2. New Note: Alt + N (Option + N on Mac)
      if (e.altKey && e.code === 'KeyN') {
        e.preventDefault()
        // If not on notes page, go to notes page first
        if (location.pathname !== '/' && location.pathname !== '/notes') {
          navigate('/')
        }
        openCreateNote()
        return
      }

      // 3. Toggle Sidebar: Cmd + B or Ctrl + B
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyB') {
        e.preventDefault()
        toggleSidebar()
        return
      }

      // 4. Toggle Dark Mode: Alt + T (Option + T on Mac)
      if (e.altKey && e.code === 'KeyT') {
        e.preventDefault()
        toggleDarkMode()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openCreateNote, toggleSidebar, toggleDarkMode, navigate, location.pathname])
}
