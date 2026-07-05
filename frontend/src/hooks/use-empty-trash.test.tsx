import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEmptyTrash } from './use-empty-trash'
import { emptyTrash } from '@/services/note-api'
import { toast } from '@/components/ui/toast'

vi.mock('@/services/note-api', () => ({
  emptyTrash: vi.fn(),
}))

vi.mock('@/components/ui/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useEmptyTrash', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('handles successful empty trash', async () => {
    vi.mocked(emptyTrash).mockResolvedValue(undefined)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useEmptyTrash(), { wrapper })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(emptyTrash).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith('Trash emptied successfully')

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes', 'trash'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tags'] })
  })

  it('handles empty trash errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Clear trash failed',
        },
      },
    }

    vi.mocked(emptyTrash).mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useEmptyTrash(), { wrapper })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Clear trash failed')
  })
})
