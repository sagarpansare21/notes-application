import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUpdateNote } from './use-update-note'
import { updateNote } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'
import type { Note } from '@/types/note'

vi.mock('@/services/note-api', () => ({
    updateNote: vi.fn(),
}))
vi.mock('@/components/ui/shadcn/toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))
describe('useUpdateNote', () => {
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
    it('updates a note successfully', async () => {
        const updatedNote = {
            id: '1',
            title: 'Updated Title',
            content: 'Updated Content',
            tags: [],
        }
        vi.mocked(updateNote).mockResolvedValue(updatedNote as unknown as Note)
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
        const { result } = renderHook(() => useUpdateNote(), {
            wrapper,
        })
        result.current.mutate({
            id: '1',
            data: {
                title: 'Updated Title',
                content: 'Updated Content',
            },
        })
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })
        expect(updateNote).toHaveBeenCalledWith('1', {
            title: 'Updated Title',
            content: 'Updated Content',
        })
        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: ['notes'],
        })
        expect(toast.error).not.toHaveBeenCalled()
    })
    it('shows error toast when update fails', async () => {
        const errorResponse = {
            response: {
                data: {
                    message: 'Failed to update note',
                },
            },
        }
        vi.mocked(updateNote).mockRejectedValue(errorResponse)
        const { result } = renderHook(() => useUpdateNote(), {
            wrapper,
        })
        result.current.mutate({
            id: '1',
            data: {
                title: 'Updated Title',
            },
        })
        await waitFor(() => {
            expect(result.current.isError).toBe(true)
        })
        expect(toast.error).toHaveBeenCalledWith('Failed to update note')
    })
    it('shows default error message when server does not return one', async () => {
        vi.mocked(updateNote).mockRejectedValue(new Error('Unknown error'))
        const { result } = renderHook(() => useUpdateNote(), {
            wrapper,
        })
        result.current.mutate({
            id: '1',
            data: {
                title: 'Updated Title',
            },
        })
        await waitFor(() => {
            expect(result.current.isError).toBe(true)
        })
        expect(toast.error).toHaveBeenCalledWith('Failed to save note')
    })
})