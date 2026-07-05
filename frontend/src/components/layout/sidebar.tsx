import { useLocation, Link } from 'react-router'
import {
  FileText,
  Tag,
  Trash2,
  Database,
  PanelLeftClose
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/shadcn/button'

interface SidebarProps {
  onCollapse: () => void
  onMobileClose?: () => void
}

export function Sidebar({ onCollapse, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    { id: 'notes', label: 'Notes', path: '/', icon: FileText },
    { id: 'tags', label: 'Tags', path: '/tags', icon: Tag },
    { id: 'trash', label: 'Trash', path: '/trash', icon: Trash2 },
    { id: 'export-import', label: 'Export/Import', path: '/export-import', icon: Database }
  ]

  const getIsActive = (itemPath: string) => {
    return pathname === itemPath
  }

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground w-64 select-none">
      <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border/60">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center justify-center size-6 rounded bg-primary text-primary-foreground font-bold text-xs shrink-0 shadow-sm">
            N
          </div>
          <span className="font-semibold text-xs text-foreground tracking-tight truncate">
            Notes Application
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          className="hidden md:flex text-muted-foreground hover:text-foreground shrink-0 size-7"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="size-4" />
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = getIsActive(item.path)
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-secondary text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
              )}
            >
              <Icon className={cn('size-4 shrink-0', isActive ? 'text-foreground' : 'text-muted-foreground')} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
