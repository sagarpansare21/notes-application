import { useSearchParams } from 'react-router'

const PAGE_SIZE = 6

export function useNotesFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const selectedTag = searchParams.get('tag') || ''
  const sortBy = searchParams.get('sortBy') || 'updatedAt'
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  const viewMode = (searchParams.get('viewMode') as 'grid' | 'list') || 'grid'
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const limit = PAGE_SIZE

  // Helpers
  const setParam = (key: string, val: string, resetPage = false) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString())
      if (val) next.set(key, val)
      else next.delete(key)
      if (resetPage) next.delete('page')
      return next
    }, { replace: true })
  }

  const setSearch = (val: string) => setParam('search', val, true)
  const setSelectedTag = (val: string) => setParam('tag', val, true)

  const setSortBy = (val: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString())
      next.set('sortBy', val)
      next.delete('page')
      return next
    }, { replace: true })
  }

  const setSortOrder = (val: 'asc' | 'desc') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString())
      next.set('sortOrder', val)
      next.delete('page')
      return next
    }, { replace: true })
  }

  const setViewMode = (val: 'grid' | 'list') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString())
      next.set('viewMode', val)
      return next
    }, { replace: true })
  }

  const setPage = (val: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString())
      if (val <= 1) next.delete('page')
      else next.set('page', String(val))
      return next
    }, { replace: true })
  }

  const clearFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString())
      next.delete('search')
      next.delete('tag')
      next.delete('page')
      return next
    }, { replace: true })
  }

  const isFiltered = search !== '' || selectedTag !== ''

  return {
    search,
    setSearch,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    page,
    limit,
    setPage,
    clearFilters,
    isFiltered,
  }
}

export type UseNotesFiltersReturn = ReturnType<typeof useNotesFilters>
