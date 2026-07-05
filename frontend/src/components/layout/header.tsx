import { useState } from 'react'
import { useLocation } from 'react-router'
import { Menu, PanelLeft, Search, Sun, Moon, Keyboard } from 'lucide-react'
import { Button } from '../ui/button'
import { KeyboardShortcutsDialog } from './keyboard-shortcuts-dialog'

interface HeaderProps {
  sidebarCollapsed: boolean
  onSidebarExpand: () => void
  onMobileOpen: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function Header({
  sidebarCollapsed,
  onSidebarExpand,
  onMobileOpen,
  darkMode,
  onToggleDarkMode
}: HeaderProps) {
  const location = useLocation()
  const pathname = location.pathname
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const getTabLabel = () => {
    switch (pathname) {
      case '/':
        return 'Notes'
      case '/tags':
        return 'Tags'
      case '/trash':
        return 'Trash'
      case '/export-import':
        return 'Export / Import'
      default:
        return 'Notes'
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 border-b border-border bg-background/70 backdrop-blur-md px-4 sm:px-6 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-xs"
          className="md:hidden size-8 text-muted-foreground hover:text-foreground shrink-0"
          onClick={onMobileOpen}
          aria-label="Open menu"
        >
          <Menu className="size-4.5" />
        </Button>

        {sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon-xs"
            className="hidden md:flex size-8 text-muted-foreground hover:text-foreground shrink-0"
            onClick={onSidebarExpand}
            aria-label="Expand sidebar"
          >
            <PanelLeft className="size-4.5" />
          </Button>
        )}

        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground select-none overflow-hidden">
          <span className="text-foreground capitalize truncate font-semibold">
            {getTabLabel()}
          </span>
        </div>
      </div>

      <div className="relative w-full max-w-[280px] sm:max-w-[360px] mx-4 hidden xs:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <input
          id="header-search-input"
          type="text"
          placeholder="Search workspaces or notes..."
          className="w-full bg-secondary/35 dark:bg-muted/20 border border-border/70 rounded-lg pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 hover:border-muted-foreground/20 focus:bg-background focus:border-ring focus:ring-3 focus:ring-ring/25 focus:outline-none transition-all duration-150"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-muted-foreground/60 bg-background dark:bg-muted border border-border/80 px-1 py-0 rounded pointer-events-none hidden sm:inline-block">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-xs"
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={() => setShortcutsOpen(true)}
          aria-label="Show keyboard shortcuts"
        >
          <Keyboard className="size-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-xs"
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={onToggleDarkMode}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="size-4 text-yellow-500" /> : <Moon className="size-4" />}
        </Button>
      </div>

      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </header>
  )
}
