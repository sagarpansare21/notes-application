import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useImportNotes } from './use-import-notes'
import { importNotes } from '@/services/note-api'
import { toast } from '@/components/ui/toast'

vi.mock('@/services/note-api', () => ({
  importNotes: vi.fn(),
}))

vi.mock('@/components/ui/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useImportNotes', () => {
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

  it('handles successful import', async () => {
    const mockStats = { imported: 10, skipped: 2, failed: 0 }
    vi.mocked(importNotes).mockResolvedValue(mockStats)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useImportNotes(), { wrapper })

    const file = new File(['[]'], 'notes.json', { type: 'application/json' })
    result.current.mutate(file)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(importNotes).toHaveBeenCalledWith(file)
    expect(toast.success).toHaveBeenCalledWith('Import completed. Imported: 10, Skipped: 2, Failed: 0')

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tags'] })
  })

  it('handles import error', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Malformed file structure',
        },
      },
    }

    vi.mocked(importNotes).mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useImportNotes(), { wrapper })

    const file = new File(['bad'], 'notes.json', { type: 'application/json' })
    result.current.mutate(file)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Malformed file structure')
  })
})
