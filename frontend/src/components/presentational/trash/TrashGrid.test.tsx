import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TrashGrid } from './TrashGrid'
import type { Note } from '@/types/note'

describe('TrashGrid', () => {
  const mockNotes: Note[] = [
    { id: '1', title: 'Deleted A', content: 'Content A', tags: [], createdAt: '', updatedAt: '' },
    { id: '2', title: 'Deleted B', content: 'Content B', tags: [], createdAt: '', updatedAt: '' },
  ]

  it('renders loading skeleton cards when isLoading is true', () => {
    render(
      <TrashGrid
        notes={undefined}
        isLoading={true}
        isError={false}
        error={null}
        onRetry={vi.fn()}
        onRestore={vi.fn()}
        onDeletePermanently={vi.fn()}
        onEmptyTrash={vi.fn()}
      />
    )

    const skeletons = screen.getAllByTestId('trash-skeleton-card')
    expect(skeletons).toHaveLength(4)
  })

  it('renders error state when isError is true', () => {
    const onRetry = vi.fn()
    const mockError = new Error('Database timeout')

    render(
      <TrashGrid
        notes={undefined}
        isLoading={false}
        isError={true}
        error={mockError}
        onRetry={onRetry}
        onRestore={vi.fn()}
        onDeletePermanently={vi.fn()}
        onEmptyTrash={vi.fn()}
      />
    )

    expect(screen.getByText('Database timeout')).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: /Try again/i })
    fireEvent.click(retryBtn)
    expect(onRetry).toHaveBeenCalled()
  })

  it('renders empty state when notes array is empty', () => {
    render(
      <TrashGrid
        notes={[]}
        isLoading={false}
        isError={false}
        error={null}
        onRetry={vi.fn()}
        onRestore={vi.fn()}
        onDeletePermanently={vi.fn()}
        onEmptyTrash={vi.fn()}
      />
    )

    expect(screen.getByText('Trash is empty')).toBeInTheDocument()
    expect(screen.getByText(/Notes you delete will appear here/i)).toBeInTheDocument()
  })

  it('renders grid of TrashCard components and supports Empty Trash trigger action flow', async () => {
    const onRestore = vi.fn()
    const onDeletePermanently = vi.fn()
    const onEmptyTrash = vi.fn()

    render(
      <TrashGrid
        notes={mockNotes}
        isLoading={false}
        isError={false}
        error={null}
        onRetry={vi.fn()}
        onRestore={onRestore}
        onDeletePermanently={onDeletePermanently}
        onEmptyTrash={onEmptyTrash}
      />
    )

    expect(screen.getByText('Deleted A')).toBeInTheDocument()
    expect(screen.getByText('Deleted B')).toBeInTheDocument()
    expect(screen.getByText('2 notes found in trash')).toBeInTheDocument()

    // Trigger Empty Trash dialogue confirmation flow
    const emptyBtn = screen.getByRole('button', { name: /Empty Trash/i })
    fireEvent.click(emptyBtn)

    expect(screen.getByText('Empty Trash Permanently?')).toBeInTheDocument()

    const confirmBtn = screen.getByRole('button', { name: 'Empty Trash' })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(onEmptyTrash).toHaveBeenCalled()
    })
  })
})
