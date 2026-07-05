import { useState, useEffect, Suspense } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from '../layout/sidebar'
import { Header } from '../layout/header'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/hooks/use-ui-store'

export function PageLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const openCreateNote = useUIStore((state) => state.openCreateNote)
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const sidebarWidthClass = sidebarCollapsed ? 'w-0 border-r-0' : 'w-64 border-r border-border'

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200 antialiased">
      <aside
        className={cn(
          'hidden md:block shrink-0 bg-sidebar select-none transition-all duration-300 ease-in-out overflow-hidden',
          sidebarWidthClass
        )}
      >
        <Sidebar onCollapse={() => setSidebarCollapsed(true)} />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/40 backdrop-blur-xs md:hidden transition-all duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:hidden shadow-2xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar
          onCollapse={() => { }}
          onMobileClose={() => setMobileOpen(false)}
        />
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onSidebarExpand={() => setSidebarCollapsed(false)}
          onMobileOpen={() => setMobileOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onNewNote={openCreateNote}
        />

        <main className="p-4 flex-1 overflow-y-auto focus:outline-none transition-all duration-200">
          <Suspense fallback={<div className="text-xs text-muted-foreground">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
