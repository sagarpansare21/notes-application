import { useState, useEffect, useRef } from 'react'
import { Search, Grid, List, ArrowUp, ArrowDown, Download, Filter } from 'lucide-react'
import { Input } from '@/components/ui/shadcn/input'
import { Button } from '@/components/ui/shadcn/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/shadcn/select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/shadcn/dropdown'

interface NotesToolbarProps {
  search: string
  onSearchChange: (search: string) => void
  selectedTag: string
  onTagChange: (tag: string) => void
  availableTags: Array<{ id: string; name: string }>
  sortBy: string
  onSortByChange: (sortBy: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onExport: (format: 'json' | 'markdown') => void
  isExporting?: boolean
  onAddNoteClick?: () => void
}

export function NotesToolbar({
  search,
  onSearchChange,
  selectedTag,
  onTagChange,
  availableTags = [],
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  viewMode,
  onViewModeChange,
  onExport,
  isExporting = false,
  onAddNoteClick,
}: NotesToolbarProps) {
  const [localSearch, setLocalSearch] = useState(search)

  const onSearchChangeRef = useRef(onSearchChange)
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChangeRef.current(localSearch)
    }, 350)
    return () => clearTimeout(timer)
  }, [localSearch])

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  return (
    <div className="flex flex-col gap-3 w-full bg-background border-b border-border/60 pb-4 select-none shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-72 md:w-80">
          <Input
            id="notes-search-input"
            placeholder="Search notes..."
            value={localSearch}
            autoComplete='off'
            onChange={(e) => setLocalSearch(e.target.value)}
            leftIcon={<Search className="size-4 opacity-60" />}
            className="h-8 py-1.5"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 min-w-[120px] max-w-[150px]">
            <Filter className="size-3.5 text-muted-foreground shrink-0" />
            <Select
              value={selectedTag || 'all'}
              onValueChange={(val) => onTagChange(val === 'all' || !val ? '' : val)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="All tags">
                  {(value) => (value === 'all' ? 'All tags' : `#${value}`)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.name}>
                    #{tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5 min-w-[120px]">
            <Select value={sortBy} onValueChange={(val) => val && onSortByChange(val)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Sort by">
                  {(value) => {
                    if (value === 'updatedAt') return 'Updated Time'
                    if (value === 'createdAt') return 'Created Time'
                    if (value === 'title') return 'Title'
                    return value
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Updated Time</SelectItem>
                <SelectItem value="createdAt">Created Time</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            className="size-8"
          >
            {sortOrder === 'asc' ? (
              <ArrowUp className="size-3.5 text-muted-foreground" />
            ) : (
              <ArrowDown className="size-3.5 text-muted-foreground" />
            )}
          </Button>

          <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />

          <div className="flex items-center border border-border bg-muted/20 rounded-md p-0.5 select-none gap-0.5 h-8">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className={`inline-flex items-center justify-center size-7 rounded-sm cursor-pointer transition-all duration-150 ${viewMode === 'grid'
                ? 'bg-card text-foreground shadow-sm border border-border/40'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Grid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              title="List View"
              className={`inline-flex items-center justify-center size-7 rounded-sm cursor-pointer transition-all duration-150 ${viewMode === 'list'
                ? 'bg-card text-foreground shadow-sm border border-border/40'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <List className="size-3.5" />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={(triggerProps) => (
                <Button
                  {...triggerProps}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 cursor-pointer text-xs"
                  loading={isExporting}
                >
                  <Download className="size-3.5 shrink-0" />
                  Export
                </Button>
              )}
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onExport('json')}
                className="cursor-pointer"
              >
                Export as JSON (.json)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExport('markdown')}
                className="cursor-pointer"
              >
                Export as Markdown (.md)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {onAddNoteClick && (
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs cursor-pointer ml-auto sm:ml-0"
              onClick={onAddNoteClick}
            >
              Add Note
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
