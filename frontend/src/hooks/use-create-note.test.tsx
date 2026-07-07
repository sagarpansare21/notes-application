import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateNote } from './use-create-note'
import { createNote } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'
import type { Note } from '@/types/note'

vi.mock('@/services/note-api', () => ({
  createNote: vi.fn(),
}))

vi.mock('@/components/ui/shadcn/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useCreateNote', () => {
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

  it('handles successful note creation', async () => {
    const mockNote = {
      id: '1',
      title: 'Success Title',
      content: 'Success Content',
      tags: [],
    }

    vi.mocked(createNote).mockResolvedValue(mockNote as unknown as Note)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const onSuccess = vi.fn()
    const { result } = renderHook(() => useCreateNote({ onSuccess }), { wrapper })

    result.current.mutate({ title: 'Success Title', content: 'Success Content', tags: [] })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(createNote).toHaveBeenCalledWith({
      title: 'Success Title',
      content: 'Success Content',
      tags: [],
    })
    expect(toast.success).toHaveBeenCalledWith('Note created successfully')
    expect(onSuccess).toHaveBeenCalled()

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tags'] })
  })

  it('handles note creation errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Server error: Invalid payload',
        },
      },
    }

    vi.mocked(createNote).mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useCreateNote(), { wrapper })

    result.current.mutate({ title: 'Fail', content: 'Fail', tags: [] })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(toast.error).toHaveBeenCalledWith('Server error: Invalid payload')
  })
})
