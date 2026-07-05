import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useNotes } from './use-notes'
import { getNotes } from '@/services/note-api'

vi.mock('@/services/note-api', () => ({
  getNotes: vi.fn(),
}))

describe('useNotes', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('fetches notes correctly with params', async () => {
    const mockNotes = [
      { id: '1', title: 'Note 1', content: 'Content 1', tags: [], createdAt: '', updatedAt: '' },
    ]
    const mockPaginatedNotes = { data: mockNotes, total: 1, limit: 6, offset: 0 }
    vi.mocked(getNotes).mockResolvedValue(mockPaginatedNotes)

    const params = { search: 'test', sortBy: 'title' }
    const { result } = renderHook(() => useNotes(params), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getNotes).toHaveBeenCalledWith(params)
    expect(result.current.data).toEqual(mockPaginatedNotes)
  })
})
