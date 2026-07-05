import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTrashNotes } from './use-trash-notes'
import { getTrashNotes } from '@/services/note-api'
import { getLocalNotes } from '@/lib/local-db'

vi.mock('@/services/note-api', () => ({
  getTrashNotes: vi.fn(),
}))

vi.mock('@/lib/local-db', () => ({
  getLocalNotes: vi.fn(),
}))

describe('useTrashNotes', () => {
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

  it('fetches trash notes correctly when online', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    })

    const mockTrashNotes = [
      { id: '1', title: 'Deleted Title', content: 'Deleted Content', tags: [], createdAt: '', updatedAt: '', deletedAt: '2026-07-05T00:00:00.000Z' },
    ]
    vi.mocked(getTrashNotes).mockResolvedValue(mockTrashNotes as any)

    const { result } = renderHook(() => useTrashNotes(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getTrashNotes).toHaveBeenCalled()
    expect(result.current.data).toEqual(mockTrashNotes)
  })

  it('loads trash notes from local db when offline (where deletedAt is present)', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    })

    const mockLocalNotes = [
      { id: '1', title: 'Active Note', content: 'Content', tags: [], createdAt: '', updatedAt: '' },
      { id: '2', title: 'Soft Deleted Note', content: 'Deleted content', tags: [], createdAt: '', updatedAt: '', deletedAt: '2026-07-05T00:00:00.000Z' },
    ]
    vi.mocked(getLocalNotes).mockResolvedValue(mockLocalNotes)

    const { result } = renderHook(() => useTrashNotes(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getLocalNotes).toHaveBeenCalled()
    expect(result.current.data).toEqual([mockLocalNotes[1]])
  })

  it('should fallback to local trash notes calculation when server call throws network error (no HTTP response)', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    })

    const mockLocalNotes = [
      { id: '1', title: 'Active Note', content: 'Content', tags: [], createdAt: '', updatedAt: '' },
      { id: '2', title: 'Soft Deleted Note', content: 'Deleted content', tags: [], createdAt: '', updatedAt: '', deletedAt: '2026-07-05T00:00:00.000Z' },
    ]
    vi.mocked(getLocalNotes).mockResolvedValue(mockLocalNotes)

    const networkError = new Error('Network Error')
    vi.mocked(getTrashNotes).mockRejectedValue(networkError)

    const { result } = renderHook(() => useTrashNotes(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([mockLocalNotes[1]])
  })

  it('should fall back to local database calculation when server responds with an HTTP error code', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    })

    const mockLocalNotes = [
      { id: '1', title: 'Active Note', content: 'Content', tags: [], createdAt: '', updatedAt: '' },
      { id: '2', title: 'Soft Deleted Note', content: 'Deleted content', tags: [], createdAt: '', updatedAt: '', deletedAt: '2026-07-05T00:00:00.000Z' },
    ]
    vi.mocked(getLocalNotes).mockResolvedValue(mockLocalNotes)

    const httpError: any = new Error('500 Server Error')
    httpError.response = { status: 500, data: {} }
    httpError.isAxiosError = true
    vi.mocked(getTrashNotes).mockRejectedValue(httpError)

    const { result } = renderHook(() => useTrashNotes(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([mockLocalNotes[1]])
  })
})
