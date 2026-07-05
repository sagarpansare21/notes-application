import { useNavigate } from 'react-router'
import { Tag as TagIcon, ArrowLeft } from 'lucide-react'
import { useTags } from '@/hooks/use-tags'
import { SectionHeader } from '@/components/ui/section-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { SkeletonLine } from '@/components/ui/skeleton'

export function TagsPage() {
  const navigate = useNavigate()
  const { data: tags, isLoading, isError, error, refetch } = useTags()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 text-left p-2 h-full">
        <SectionHeader title="Tags" description="Browse and filter notes by their categories." />
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
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4 text-left p-2 h-full">
        <SectionHeader title="Tags" description="Browse and filter notes by their categories." />
        <div className="flex-1 flex items-center justify-center">
          <ErrorState message={error?.message || 'Failed to load tags'} onRetry={refetch} />
        </div>
      </div>
    )
  }

  if (!tags || tags.length === 0) {
    return (
      <div className="flex flex-col gap-4 text-left p-2 h-full">
        <SectionHeader title="Tags" description="Browse and filter notes by their categories." />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<TagIcon className="size-6 text-muted-foreground/60" />}
            title="No tags found"
            description="Create a note and add tags to organize your dashboard."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 text-left p-2 h-full">
      <SectionHeader title="Tags" description="Browse and filter notes by their categories." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {tags.map((tag) => (
          <Card
            key={tag.id}
            hoverable
            className="p-5 flex flex-col justify-between gap-4 cursor-pointer select-none border-border/80 hover:border-primary/50 hover:bg-primary/[0.01] hover:shadow-md transition-all duration-300"
            onClick={() => navigate(`/?tag=${encodeURIComponent(tag.name)}`)}
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
    </div>
  )
}
