import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TrashCard } from './TrashCard'
import type { Note } from '@/types/note'

describe('TrashCard', () => {
  const mockNote: Note = {
    id: 'note-123',
    title: 'Deleted Item',
    content: 'Some deleted markdown content.',
    tags: [],
    createdAt: '2026-07-05T00:00:00.000Z',
    updatedAt: '2026-07-05T00:00:00.000Z',
  }

  it('renders note title and formatted date', () => {
    const onRestore = vi.fn()
    const onDeletePermanently = vi.fn()

    render(
      <TrashCard
        note={mockNote}
        onRestore={onRestore}
        onDeletePermanently={onDeletePermanently}
      />
    )

    expect(screen.getByText('Deleted Item')).toBeInTheDocument()
    expect(screen.getByText('Some deleted markdown content.')).toBeInTheDocument()
  })

  it('calls onRestore when restore button is clicked', () => {
    const onRestore = vi.fn()
    const onDeletePermanently = vi.fn()

    render(
      <TrashCard
        note={mockNote}
        onRestore={onRestore}
        onDeletePermanently={onDeletePermanently}
      />
    )

    const restoreBtn = screen.getByTitle('Restore Note')
    fireEvent.click(restoreBtn)

    expect(onRestore).toHaveBeenCalledWith(mockNote.id)
  })

  it('opens confirmation dialog on delete click and calls onDeletePermanently on confirm', async () => {
    const onRestore = vi.fn()
    const onDeletePermanently = vi.fn()

    render(
      <TrashCard
        note={mockNote}
        onRestore={onRestore}
        onDeletePermanently={onDeletePermanently}
      />
    )

    // Dialogue is initially not in the document (or hidden)
    expect(screen.queryByText('Delete Note Permanently?')).not.toBeInTheDocument()

    // Trigger delete click
    const deleteBtn = screen.getByTitle('Delete Permanently')
    fireEvent.click(deleteBtn)

    // Verify dialog opens
    expect(screen.getByText('Delete Note Permanently?')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to permanently delete/i)).toBeInTheDocument()

    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: 'Delete Permanently' })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(onDeletePermanently).toHaveBeenCalledWith(mockNote.id)
    })
  })

  it('closes dialog on cancel click', async () => {
    const onRestore = vi.fn()
    const onDeletePermanently = vi.fn()

    render(
      <TrashCard
        note={mockNote}
        onRestore={onRestore}
        onDeletePermanently={onDeletePermanently}
      />
    )

    const deleteBtn = screen.getByTitle('Delete Permanently')
    fireEvent.click(deleteBtn)

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelBtn)

    await waitFor(() => {
      expect(screen.queryByText('Delete Note Permanently?')).not.toBeInTheDocument()
    })
  })
})
