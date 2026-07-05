import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTrashNotes } from './use-trash-notes'
import { getTrashNotes } from '@/services/note-api'

vi.mock('@/services/note-api', () => ({
  getTrashNotes: vi.fn(),
}))

describe('useTrashNotes', () => {
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

  it('fetches trash notes correctly', async () => {
    const mockTrashNotes = [
      { id: '1', title: 'Deleted Title', content: 'Deleted Content', tags: [] },
    ]
    vi.mocked(getTrashNotes).mockResolvedValue(mockTrashNotes as any)

    const { result } = renderHook(() => useTrashNotes(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getTrashNotes).toHaveBeenCalled()
    expect(result.current.data).toEqual(mockTrashNotes)
  })
})
