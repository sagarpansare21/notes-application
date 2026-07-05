import { SectionHeader } from '@/components/shared/section-header'
import { ExportImportContainer } from '@/containers/export-import'

export function ExportImportPage() {
  return (
    <div className="flex flex-col gap-4 text-left p-2 h-full">
      <SectionHeader
        title="Export / Import"
        description="Transfer your notes data to local backups or import from previous exports."
      />
      <ExportImportContainer />
    </div>
  )
}
