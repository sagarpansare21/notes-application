import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDeletePermanently } from './use-delete-permanently'
import { deleteNotePermanently } from '@/services/note-api'
import { toast } from '@/components/ui/toast'

vi.mock('@/services/note-api', () => ({
  deleteNotePermanently: vi.fn(),
}))

vi.mock('@/components/ui/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useDeletePermanently', () => {
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

  it('handles successful permanent deletion', async () => {
    vi.mocked(deleteNotePermanently).mockResolvedValue(undefined)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeletePermanently(), { wrapper })

    result.current.mutate('note-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(deleteNotePermanently).toHaveBeenCalledWith('note-1')
    expect(toast.success).toHaveBeenCalledWith('Note deleted permanently')

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes', 'trash'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tags'] })
  })

  it('handles permanent deletion errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Server error: permanent delete failed',
        },
      },
    }

    vi.mocked(deleteNotePermanently).mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useDeletePermanently(), { wrapper })

    result.current.mutate('note-1')

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Server error: permanent delete failed')
  })
})
