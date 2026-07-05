import { Tag as TagIcon } from 'lucide-react'
import type { Tag } from '@/types/note'
import { Card } from '@/components/ui/shadcn/card'
import { Badge } from '@/components/ui/shadcn/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { SkeletonLine } from '@/components/ui/shadcn/skeleton'

interface TagsGridProps {
  tags?: Tag[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  onRetry: () => void
  onTagClick: (tag: Tag) => void
}

export function TagsGrid({
  tags,
  isLoading,
  isError,
  error,
  onRetry,
  onTagClick,
}: TagsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-5 flex flex-col gap-3" data-testid="tag-skeleton-card">
            <div className="flex items-center gap-3">
              <SkeletonLine height="h-8" width="w-8" className="rounded-lg" />
              <SkeletonLine height="h-4" width="w-24" />
            </div>
            <SkeletonLine height="h-3" width="w-16" className="ml-11" />
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <ErrorState message={error?.message || 'Failed to load tags'} onRetry={onRetry} />
      </div>
    )
  }

  if (!tags || tags.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <EmptyState
          icon={<TagIcon className="size-6 text-muted-foreground/60" />}
          title="No tags found"
          description="Create a note and add tags to organize your dashboard."
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
      {tags.map((tag) => (
        <Card
          key={tag.id}
          hoverable
          className="p-5 flex flex-col justify-between gap-4 cursor-pointer select-none border-border/80 hover:border-primary/50 hover:bg-primary/[0.01] hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-200"
          onClick={() => onTagClick(tag)}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center size-8 rounded-lg bg-secondary/80 text-muted-foreground shrink-0">
                <TagIcon className="size-4" />
              </div>
              <span className="font-semibold text-foreground truncate text-sm">
                {tag.name}
              </span>
            </div>
            <Badge variant="secondary" className="shrink-0 text-[10px] px-2 py-0.5 font-medium">
              {tag.noteCount ?? 0} {tag.noteCount === 1 ? 'note' : 'notes'}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}
