import { useTags } from '@/hooks/use-tags'
import { useNotes } from '@/hooks/use-notes'
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

  const offset = (filters.page - 1) * filters.limit
  const { data: paginatedNotes } = useNotes({
    search: filters.search,
    tag: filters.selectedTag,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    limit: filters.limit,
    offset,
  })

  // Hide toolbar if notes are loaded, total is 0, and no filters are active
  const hideToolbar = paginatedNotes && !Array.isArray(paginatedNotes) && paginatedNotes.total === 0 && !filters.isFiltered
  if (hideToolbar) {
    return null
  }

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
