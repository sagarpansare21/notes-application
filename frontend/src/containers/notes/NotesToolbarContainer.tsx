import { useTags } from '@/hooks/use-tags'
import { useUIStore } from '@/hooks/use-ui-store'
import { useExportNotes } from '@/hooks/useExportNotes'
import { NotesToolbar } from '@/components/presentational/notes'
import type { UseNotesFiltersReturn } from '@/hooks/useNotesFilters'

interface NotesToolbarContainerProps {
  filters: UseNotesFiltersReturn
}

export function NotesToolbarContainer({ filters }: NotesToolbarContainerProps) {
  const { data: tags = [] } = useTags()
  const { isExporting, exportNotes } = useExportNotes()
  const openCreateNote = useUIStore((state) => state.openCreateNote)

  return (
    <NotesToolbar
      search={filters.search}
      onSearchChange={filters.setSearch}
      selectedTag={filters.selectedTag}
      onTagChange={filters.setSelectedTag}
      availableTags={tags}
      sortBy={filters.sortBy}
      onSortByChange={filters.setSortBy}
      sortOrder={filters.sortOrder}
      onSortOrderChange={filters.setSortOrder}
      viewMode={filters.viewMode}
      onViewModeChange={filters.setViewMode}
      onExport={exportNotes}
      isExporting={isExporting}
      onAddNoteClick={openCreateNote}
    />
  )
}
