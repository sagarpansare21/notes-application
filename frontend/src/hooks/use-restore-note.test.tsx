import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRestoreNote } from './use-restore-note'
import { restoreNote } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'

vi.mock('@/services/note-api', () => ({
  restoreNote: vi.fn(),
}))

vi.mock('@/components/ui/shadcn/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useRestoreNote', () => {
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

  it('handles successful note restoration', async () => {
    vi.mocked(restoreNote).mockResolvedValue(undefined)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useRestoreNote(), { wrapper })

    result.current.mutate('note-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(restoreNote).toHaveBeenCalledWith('note-1')
    expect(toast.success).toHaveBeenCalledWith('Note restored successfully')

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes', 'trash'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tags'] })
  })

  it('handles note restoration errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Server error: restore failed',
        },
      },
    }

    vi.mocked(restoreNote).mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useRestoreNote(), { wrapper })

    result.current.mutate('note-1')

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Server error: restore failed')
  })
})
