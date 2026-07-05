import { SectionHeader } from '@/components/shared/section-header'
import { TrashContainer } from '@/containers/trash'

export function TrashPage() {
  return (
    <div className="flex flex-col gap-4 text-left p-2 h-full">
      <SectionHeader
        title="Trash"
        description="Review and restore or permanently delete your notes."
      />
      <TrashContainer />
    </div>
  )
}
