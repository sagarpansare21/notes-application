import { TagChip } from './tag-chip'
import { cn } from '@/lib/utils'

export interface TagListProps {
  tags: string[]
  activeTags?: string[]
  onTagClick?: (tag: string) => void
  onTagRemove?: (tag: string) => void
  className?: string
}

export function TagList({
  tags,
  activeTags = [],
  onTagClick,
  onTagRemove,
  className,
}: TagListProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => {
        const isActive = activeTags.includes(tag)
        return (
          <TagChip
            key={tag}
            label={tag}
            active={isActive}
            onClick={() => onTagClick?.(tag)}
            onRemove={onTagRemove ? () => onTagRemove(tag) : undefined}
          />
        )
      })}
    </div>
  )
}
