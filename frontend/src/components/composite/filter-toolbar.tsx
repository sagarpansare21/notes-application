import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { SearchBar } from './search-bar'
import { TagList } from './tag-list'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export interface FilterToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  tags: string[]
  activeTags: string[]
  onTagToggle: (tag: string) => void
  onClearFilters?: () => void
  className?: string
}

export function FilterToolbar({
  searchQuery,
  onSearchChange,
  tags,
  activeTags,
  onTagToggle,
  onClearFilters,
  className,
}: FilterToolbarProps) {
  const hasActiveFilters = searchQuery !== '' || activeTags.length > 0

  return (
    <div className={cn("flex flex-col gap-4 p-4 rounded-xl border border-border bg-card shadow-sm", className)}>
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <SearchBar
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter notes..."
          className="max-w-full sm:max-w-[280px]"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs shrink-0">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <span>More Filters</span>
          </Button>
          {hasActiveFilters && onClearFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Filter by Tags
          </span>
          <TagList
            tags={tags}
            activeTags={activeTags}
            onTagClick={onTagToggle}
          />
        </div>
      )}
    </div>
  )
}
