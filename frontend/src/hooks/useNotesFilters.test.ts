import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotesFilters } from './useNotesFilters'

vi.mock('react-router', () => {
  return {
    useSearchParams: () => {
      const [params, setParams] = useState(new URLSearchParams())
      const setSearchParams = (
        nextInit: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
        _navigateOpts?: any
      ) => {
        if (typeof nextInit === 'function') {
          setParams((prev) => nextInit(prev))
        } else {
          setParams(nextInit)
        }
      }
      return [params, setSearchParams] as const
    },
  }
})

describe('useNotesFilters', () => {
  it('manages URL search params state and clears filters correctly', () => {
    const { result } = renderHook(() => useNotesFilters())

    expect(result.current.search).toBe('')
    expect(result.current.selectedTag).toBe('')
    expect(result.current.sortBy).toBe('updatedAt')
    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.viewMode).toBe('grid')
    expect(result.current.isFiltered).toBe(false)

    act(() => {
      result.current.setSearch('my search')
      result.current.setSelectedTag('work')
      result.current.setSortBy('title')
      result.current.setSortOrder('asc')
      result.current.setViewMode('list')
    })

    expect(result.current.search).toBe('my search')
    expect(result.current.selectedTag).toBe('work')
    expect(result.current.sortBy).toBe('title')
    expect(result.current.sortOrder).toBe('asc')
    expect(result.current.viewMode).toBe('list')
    expect(result.current.isFiltered).toBe(true)

    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.search).toBe('')
    expect(result.current.selectedTag).toBe('')
    expect(result.current.isFiltered).toBe(false)
    expect(result.current.viewMode).toBe('list')
  })
})
