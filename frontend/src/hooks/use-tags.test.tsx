import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTags } from './use-tags'
import { getTags } from '@/services/note-api'

vi.mock('@/services/note-api', () => ({
  getTags: vi.fn(),
}))

describe('useTags', () => {
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

  it('fetches tags correctly', async () => {
    const mockTags = [
      { id: '1', name: 'work' },
      { id: '2', name: 'personal' },
    ]
    vi.mocked(getTags).mockResolvedValue(mockTags)

    const { result } = renderHook(() => useTags(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getTags).toHaveBeenCalled()
    expect(result.current.data).toEqual(mockTags)
  })
})
