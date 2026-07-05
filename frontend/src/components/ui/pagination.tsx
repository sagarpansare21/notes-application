import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const pages = getPages()

  return (
    <div className={cn('flex items-center justify-center gap-1 mt-4 select-none', className)}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
          'border border-border',
          currentPage === 1
            ? 'text-muted-foreground/40 cursor-not-allowed bg-transparent border-border/40'
            : 'text-foreground hover:bg-accent cursor-pointer'
        )}
      >
        <ChevronLeft className="size-3.5" />
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              'min-w-[32px] px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors border cursor-pointer',
              p === currentPage
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-foreground hover:bg-accent'
            )}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
          'border border-border',
          currentPage === totalPages
            ? 'text-muted-foreground/40 cursor-not-allowed bg-transparent border-border/40'
            : 'text-foreground hover:bg-accent cursor-pointer'
        )}
      >
        Next
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  )
}
