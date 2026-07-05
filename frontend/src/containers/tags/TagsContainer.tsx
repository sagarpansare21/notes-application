import { useNavigate } from 'react-router'
import { useTags } from '@/hooks/use-tags'
import { TagsGrid } from '@/components/presentational/tags'
import type { Tag } from '@/types/note'

export function TagsContainer() {
  const navigate = useNavigate()
  const { data: tags, isLoading, isError, error, refetch } = useTags()

  const handleTagClick = (tag: Tag) => {
    navigate(`/?tag=${encodeURIComponent(tag.name)}`)
  }

  return (
    <TagsGrid
      tags={tags}
      isLoading={isLoading}
      isError={isError}
      error={error as Error | null}
      onRetry={refetch}
      onTagClick={handleTagClick}
    />
  )
}
