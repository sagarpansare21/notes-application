import { useEffect, Suspense } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { OfflineBanner } from '@/components/ui/offline-banner'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/hooks/use-ui-store'
import { useOfflineStatus } from '@/hooks/use-offline-status'

export function PageLayout() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed)
  const mobileOpen = useUIStore((state) => state.mobileOpen)
  const setMobileOpen = useUIStore((state) => state.setMobileOpen)
  const openCreateNote = useUIStore((state) => state.openCreateNote)
  const darkMode = useUIStore((state) => state.darkMode)
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode)

  const isOffline = useOfflineStatus()

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
        {/* Offline banner sits between header and main */}
        {isOffline && <OfflineBanner />}

        <Header
          sidebarCollapsed={sidebarCollapsed}
          onSidebarExpand={() => setSidebarCollapsed(false)}
          onMobileOpen={() => setMobileOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onNewNote={openCreateNote}
        />

        <main className="p-4 flex-1 overflow-y-auto focus:outline-none transition-all duration-200">
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
