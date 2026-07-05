import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TrashPage } from './trash'
import { useTrashNotes } from '@/hooks/use-trash-notes'
import { useRestoreNote } from '@/hooks/use-restore-note'
import { useDeletePermanently } from '@/hooks/use-delete-permanently'
import { useEmptyTrash } from '@/hooks/use-empty-trash'

vi.mock('@/hooks/use-trash-notes', () => ({
  useTrashNotes: vi.fn(),
}))

vi.mock('@/hooks/use-restore-note', () => ({
  useRestoreNote: vi.fn(),
}))

vi.mock('@/hooks/use-delete-permanently', () => ({
  useDeletePermanently: vi.fn(),
}))

vi.mock('@/hooks/use-empty-trash', () => ({
  useEmptyTrash: vi.fn(),
}))

describe('TrashPage', () => {
  const mockRestoreMutate = vi.fn()
  const mockDeleteMutate = vi.fn()
  const mockEmptyMutate = vi.fn()

  const mockNotes = [
    { id: '1', title: 'Note in Trash', content: 'Deleted markdown content', tags: [], createdAt: '', updatedAt: '' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useRestoreNote).mockReturnValue({
      mutate: mockRestoreMutate,
      isPending: false,
    } as any)

    vi.mocked(useDeletePermanently).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    } as any)

    vi.mocked(useEmptyTrash).mockReturnValue({
      mutate: mockEmptyMutate,
      isPending: false,
    } as any)
  })

  it('renders trash header and loading skeleton', () => {
    vi.mocked(useTrashNotes).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<TrashPage />)

    expect(screen.getByText('Trash')).toBeInTheDocument()
    expect(screen.getByText('Review and restore or permanently delete your notes.')).toBeInTheDocument()
    expect(screen.getAllByTestId('trash-skeleton-card')).toHaveLength(4)
  })

  it('renders deleted notes list and trigger restore mutation', () => {
    vi.mocked(useTrashNotes).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<TrashPage />)

    expect(screen.getByText('Note in Trash')).toBeInTheDocument()

    const restoreBtn = screen.getByTitle('Restore Note')
    fireEvent.click(restoreBtn)

    expect(mockRestoreMutate).toHaveBeenCalledWith('1')
  })

  it('triggers delete permanently mutation from confirmation dialog', async () => {
    vi.mocked(useTrashNotes).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<TrashPage />)

    const deleteBtn = screen.getByTitle('Delete Permanently')
    fireEvent.click(deleteBtn)

    // Find and click confirm button in modal
    const confirmBtn = screen.getByRole('button', { name: 'Delete Permanently' })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith('1')
    })
  })

  it('triggers empty trash mutation from empty trash confirmation dialog', async () => {
    vi.mocked(useTrashNotes).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<TrashPage />)

    const emptyBtn = screen.getByRole('button', { name: /Empty Trash/i })
    fireEvent.click(emptyBtn)

    // Click Empty Trash confirmation button in modal
    const confirmBtn = screen.getByRole('button', { name: 'Empty Trash' })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(mockEmptyMutate).toHaveBeenCalled()
    })
  })
})
