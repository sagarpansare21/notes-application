import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTags } from './use-tags'
import { getTags } from '@/services/note-api'
import { getLocalNotes } from '@/lib/local-db'

vi.mock('@/services/note-api', () => ({
  getTags: vi.fn(),
}))

vi.mock('@/lib/local-db', () => ({
  getLocalNotes: vi.fn(),
}))

describe('useTags', () => {
  let queryClient: QueryClient
  let originalOnLine: boolean

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
    originalOnLine = navigator.onLine
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      value: originalOnLine,
      configurable: true,
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('fetches tags correctly when online', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    })

    const mockTags = [
      { id: '1', name: 'work', noteCount: 1 },
      { id: '2', name: 'personal', noteCount: 1 },
    ]
    vi.mocked(getTags).mockResolvedValue(mockTags)

    const { result } = renderHook(() => useTags(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getTags).toHaveBeenCalled()
    expect(result.current.data).toEqual(mockTags)
  })

  it('computes tags dynamically from local notes when offline', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    })

    const mockLocalNotes = [
      { id: '1', title: 'Work task', content: 'Do something', tags: ['work', 'important'], createdAt: '', updatedAt: '' },
      { id: '2', title: 'Shopping', content: 'Buy milk', tags: ['personal', 'important'], createdAt: '', updatedAt: '' },
      { id: '3', title: 'Deleted', content: 'Removed', tags: ['work'], createdAt: '', updatedAt: '', deletedAt: '2026-07-05T00:00:00.000Z' },
    ]
    vi.mocked(getLocalNotes).mockResolvedValue(mockLocalNotes)

    const { result } = renderHook(() => useTags(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Active tags are computed. 'work' (1 active), 'important' (2 active), 'personal' (1 active)
    const data = result.current.data || []
    expect(data.find(t => t.name === 'work')?.noteCount).toBe(1)
    expect(data.find(t => t.name === 'important')?.noteCount).toBe(2)
    expect(data.find(t => t.name === 'personal')?.noteCount).toBe(1)
    expect(data.length).toBe(3)
  })

  it('should fallback to local tags computation when server call throws network error (no HTTP response)', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    })

    const mockLocalNotes = [
      { id: '1', title: 'A', content: 'B', tags: ['local-tag'], createdAt: '', updatedAt: '' },
    ]
    vi.mocked(getLocalNotes).mockResolvedValue(mockLocalNotes)

    const networkError = new Error('Network Error')
    vi.mocked(getTags).mockRejectedValue(networkError)

    const { result } = renderHook(() => useTags(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.length).toBe(1)
    expect(result.current.data?.[0].name).toBe('local-tag')
  })

  it('should rethrow error when server responds with an HTTP error code', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    })

    const httpError: any = new Error('500 Server Error')
    httpError.response = { status: 500, data: {} }
    httpError.isAxiosError = true
    vi.mocked(getTags).mockRejectedValue(httpError)

    const { result } = renderHook(() => useTags(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBe(httpError)
  })
})
