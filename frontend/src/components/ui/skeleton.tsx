import React from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-secondary dark:bg-muted', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export function SkeletonCircle({
  size = 'size-10',
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: string }) {
  return <Skeleton className={cn('rounded-full shrink-0', size, className)} {...props} />
}

export function SkeletonLine({
  className,
  width = 'w-full',
  height = 'h-4',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { width?: string; height?: string }) {
  return <Skeleton className={cn('rounded', width, height, className)} {...props} />
}

export function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border p-5 bg-card flex flex-col gap-4 w-full shadow-notion',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <SkeletonCircle size="size-9" />
        <div className="flex flex-col gap-1.5 w-1/3">
          <SkeletonLine height="h-3.5" width="w-full" />
          <SkeletonLine height="h-2.5" width="w-1/2" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonLine height="h-3" width="w-full" />
        <SkeletonLine height="h-3" width="w-11/12" />
        <SkeletonLine height="h-3" width="w-4/5" />
      </div>
    </div>
  )
}
