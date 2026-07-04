import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const getPages = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 'ellipsis', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, 'ellipsis', currentPage, 'ellipsis', totalPages)
      }
    }
    return pages
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center gap-1.5", className)}
      {...props}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1 pl-2.5 h-8 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        <span>Previous</span>
      </Button>

      <div className="flex items-center gap-1">
        {getPages().map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex size-8 items-center justify-center text-muted-foreground/60"
              >
                <MoreHorizontal className="size-4" />
              </span>
            )
          }

          const isCurrent = page === currentPage
          return (
            <Button
              key={page}
              variant={isCurrent ? 'default' : 'outline'}
              size="icon-xs"
              onClick={() => onPageChange(page)}
              className={cn("size-8 text-xs font-medium", !isCurrent && "border-border hover:bg-muted")}
              aria-current={isCurrent ? "page" : undefined}
            >
              {page}
            </Button>
          )
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1 pr-2.5 h-8 text-xs text-muted-foreground hover:text-foreground"
      >
        <span>Next</span>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}
