import { SectionHeader } from '@/components/shared/section-header'
import { TagsContainer } from '@/containers/tags'

export function TagsPage() {
  return (
    <div className="flex flex-col gap-4 text-left p-2 h-full">
      <SectionHeader title="Tags" description="Browse and filter notes by their categories." />
      <TagsContainer />
    </div>
  )
}
