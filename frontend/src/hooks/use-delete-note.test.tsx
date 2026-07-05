import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDeleteNote } from './use-delete-note'
import { deleteNote } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'

vi.mock('@/services/note-api', () => ({
  deleteNote: vi.fn(),
}))

vi.mock('@/components/ui/shadcn/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useDeleteNote', () => {
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

  it('handles successful note deletion', async () => {
    vi.mocked(deleteNote).mockResolvedValue(undefined)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteNote(), { wrapper })

    result.current.mutate('note-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(deleteNote).toHaveBeenCalledWith('note-1')
    expect(toast.success).toHaveBeenCalledWith('Note moved to trash')

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tags'] })
  })

  it('handles note deletion errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Server error: delete failed',
        },
      },
    }

    vi.mocked(deleteNote).mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useDeleteNote(), { wrapper })

    result.current.mutate('note-1')

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Server error: delete failed')
  })
})
