import { Card } from '@/components/ui/card'

interface NoteSkeletonProps {
  viewMode?: 'grid' | 'list'
}

export function NoteSkeleton({ viewMode = 'grid' }: NoteSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <Card className="flex items-center justify-between gap-4 p-3 border border-border bg-card animate-pulse select-none">
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="h-4 w-1/4 bg-secondary/80 rounded shrink-0" />
          <div className="h-3 w-1/2 bg-secondary/80 rounded flex-1" />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-4.5 w-12 bg-secondary/80 rounded border border-border/50" />
          <div className="h-4.5 w-16 bg-secondary/80 rounded border border-border/50" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-3 w-16 bg-secondary/80 rounded" />
          <div className="size-6 bg-secondary/80 rounded-md" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col justify-between p-4.5 border border-border bg-card min-h-[140px] gap-3 text-left animate-pulse select-none">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-secondary/80 rounded" />

        <div className="flex flex-col gap-1.5 mt-2">
          <div className="h-3.5 w-full bg-secondary/80 rounded" />
          <div className="h-3.5 w-5/6 bg-secondary/80 rounded" />
          <div className="h-3.5 w-2/3 bg-secondary/80 rounded" />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex gap-1.5 h-[18px]">
          <div className="h-4.5 w-12 bg-secondary/80 rounded border border-border/50" />
          <div className="h-4.5 w-16 bg-secondary/80 rounded border border-border/50" />
        </div>

        <div className="flex items-center justify-between border-t border-border/30 pt-2">
          <div className="h-3.5 w-20 bg-secondary/80 rounded" />
        </div>
      </div>
    </Card>
  )
}
