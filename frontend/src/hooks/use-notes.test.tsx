import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useNotes } from './use-notes'
import { getNotes } from '@/services/note-api'
import { getLocalNotes, upsertLocalNotes } from '@/lib/local-db'

vi.mock('@/services/note-api', () => ({
  getNotes: vi.fn(),
}))

vi.mock('@/lib/local-db', () => ({
  getLocalNotes: vi.fn(),
  upsertLocalNotes: vi.fn().mockResolvedValue(undefined),
}))

describe('useNotes', () => {
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

  it('fetches notes correctly with params when online and saves them locally', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    })

    const mockNotes = [
      { id: '1', title: 'Note 1', content: 'Content 1', tags: [], createdAt: '', updatedAt: '' },
    ]
    const mockPaginatedNotes = { data: mockNotes, total: 1, limit: 6, offset: 0 }
    vi.mocked(getNotes).mockResolvedValue(mockPaginatedNotes)

    const params = { search: 'test', sortBy: 'title' }
    const { result } = renderHook(() => useNotes(params), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getNotes).toHaveBeenCalledWith(params)
    expect(result.current.data).toEqual(mockPaginatedNotes)
    expect(upsertLocalNotes).toHaveBeenCalledWith(mockNotes)
  })

  it('serves cached notes from local db when offline', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    })

    const mockLocalNotes = [
      { id: '1', title: 'Work task', content: 'Do something', tags: ['work'], createdAt: '', updatedAt: '' },
      { id: '2', title: 'Shopping', content: 'Buy milk', tags: ['personal'], createdAt: '', updatedAt: '' },
    ]
    vi.mocked(getLocalNotes).mockResolvedValue(mockLocalNotes)

    const { result } = renderHook(() => useNotes(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.data).toEqual(mockLocalNotes)
    expect(result.current.data?.total).toBe(2)
  })

  it('filters offline notes by search text and tags correctly', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    })

    const mockLocalNotes = [
      { id: '1', title: 'Work Task', content: 'Do something important', tags: ['work'], createdAt: '', updatedAt: '' },
      { id: '2', title: 'Shopping', content: 'Buy milk', tags: ['personal'], createdAt: '', updatedAt: '' },
    ]
    vi.mocked(getLocalNotes).mockResolvedValue(mockLocalNotes)

    const params = { search: 'task', tag: 'work' }
    const { result } = renderHook(() => useNotes(params), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.data).toEqual([mockLocalNotes[0]])
    expect(result.current.data?.total).toBe(1)
  })

  it('paginates offline notes correctly', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    })

    const mockLocalNotes = [
      { id: '1', title: 'N1', content: 'C1', tags: [], createdAt: '', updatedAt: '' },
      { id: '2', title: 'N2', content: 'C2', tags: [], createdAt: '', updatedAt: '' },
      { id: '3', title: 'N3', content: 'C3', tags: [], createdAt: '', updatedAt: '' },
    ]
    vi.mocked(getLocalNotes).mockResolvedValue(mockLocalNotes)

    const params = { limit: 2, offset: 1 }
    const { result } = renderHook(() => useNotes(params), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.data).toEqual([mockLocalNotes[1], mockLocalNotes[2]])
    expect(result.current.data?.total).toBe(3)
  })
})
