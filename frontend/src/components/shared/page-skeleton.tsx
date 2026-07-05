import { cn } from '@/lib/utils'

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn('bg-secondary/70 rounded-md animate-pulse', className)} />
  )
}

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-2 h-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <Shimmer className="h-5 w-24" />
        <Shimmer className="h-3 w-52" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/60">
        <Shimmer className="h-8 w-64 rounded-md" />
        <Shimmer className="h-8 w-28 rounded-md" />
        <Shimmer className="h-8 w-28 rounded-md" />
        <Shimmer className="h-8 w-8 rounded-md" />
        <div className="ml-auto flex gap-2">
          <Shimmer className="h-8 w-20 rounded-md" />
          <Shimmer className="h-8 w-20 rounded-md" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-4 border border-border rounded-xl bg-card min-h-[140px] gap-3 animate-pulse"
          >
            <div className="flex flex-col gap-2">
              <Shimmer className="h-4 w-3/4" />
              <div className="flex flex-col gap-1.5 mt-1">
                <Shimmer className="h-3 w-full" />
                <Shimmer className="h-3 w-5/6" />
                <Shimmer className="h-3 w-2/3" />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex gap-1.5">
                <Shimmer className="h-4 w-12 rounded-full" />
                <Shimmer className="h-4 w-16 rounded-full" />
              </div>
              <div className="border-t border-border/30 pt-2">
                <Shimmer className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
