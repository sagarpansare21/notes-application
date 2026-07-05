import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NoteCard } from './NoteCard'
import type { Note } from '@/types/note'

describe('NoteCard', () => {
  const mockNote: Note = {
    id: '1',
    title: 'Test Note Title',
    content: '## Heading\nThis is a simple markdown content with a [link](https://example.com).',
    tags: ['work', 'personal'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  it('renders note fields correctly in grid mode', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<NoteCard note={mockNote} viewMode="grid" onDelete={onDelete} onEdit={onEdit} />)

    expect(screen.getByText('Test Note Title')).toBeInTheDocument()
    expect(screen.getByText(/Heading This is a simple markdown content/i)).toBeInTheDocument()
    expect(screen.getByText('#work')).toBeInTheDocument()
    expect(screen.getByText('#personal')).toBeInTheDocument()
  })

  it('renders note fields correctly in list mode', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<NoteCard note={mockNote} viewMode="list" onDelete={onDelete} onEdit={onEdit} />)

    expect(screen.getByText('Test Note Title')).toBeInTheDocument()
    expect(screen.getByText(/Heading This is a simple markdown content/i)).toBeInTheDocument()
  })

  it('calls onDelete callback when delete menu item is clicked', async () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<NoteCard note={mockNote} viewMode="grid" onDelete={onDelete} onEdit={onEdit} />)

    const actionBtn = screen.getByRole('button', { name: 'Note actions' })
    fireEvent.click(actionBtn)

    const deleteItem = screen.getByText(/Delete/i)
    expect(deleteItem).toBeInTheDocument()
    fireEvent.click(deleteItem)

    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('calls onEdit callback when edit menu item is clicked', async () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<NoteCard note={mockNote} viewMode="grid" onDelete={onDelete} onEdit={onEdit} />)

    const actionBtn = screen.getByRole('button', { name: 'Note actions' })
    fireEvent.click(actionBtn)

    const editItem = screen.getByText(/Edit/i)
    expect(editItem).toBeInTheDocument()
    fireEvent.click(editItem)

    expect(onEdit).toHaveBeenCalledWith(mockNote)
  })

  it('triggers onEdit on Enter and Space, and onDelete on Delete and Backspace keys', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<NoteCard note={mockNote} viewMode="grid" onDelete={onDelete} onEdit={onEdit} />)

    const card = screen.getByRole('button', { name: `Edit note: ${mockNote.title}` })

    // Enter key press triggers onEdit
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
    expect(onEdit).toHaveBeenCalledWith(mockNote)

    // Space key press triggers onEdit
    fireEvent.keyDown(card, { key: ' ', code: 'Space' })
    expect(onEdit).toHaveBeenCalledWith(mockNote)

    // Delete key press triggers onDelete
    fireEvent.keyDown(card, { key: 'Delete', code: 'Delete' })
    expect(onDelete).toHaveBeenCalledWith('1')

    // Backspace key press triggers onDelete
    fireEvent.keyDown(card, { key: 'Backspace', code: 'Backspace' })
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('calls onEdit when card body is clicked in list mode', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<NoteCard note={mockNote} viewMode="list" onDelete={onDelete} onEdit={onEdit} />)

    const card = screen.getByRole('button', { name: `Edit note: ${mockNote.title}` })
    fireEvent.click(card)

    expect(onEdit).toHaveBeenCalledWith(mockNote)
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('triggers onEdit on keyboard nav in list mode (Enter/Space) and onDelete on Delete/Backspace', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<NoteCard note={mockNote} viewMode="list" onDelete={onDelete} onEdit={onEdit} />)

    const card = screen.getByRole('button', { name: `Edit note: ${mockNote.title}` })

    fireEvent.keyDown(card, { key: 'Enter' })
    expect(onEdit).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(card, { key: ' ' })
    expect(onEdit).toHaveBeenCalledTimes(2)

    fireEvent.keyDown(card, { key: 'Delete' })
    expect(onDelete).toHaveBeenCalledWith('1')

    fireEvent.keyDown(card, { key: 'Backspace' })
    expect(onDelete).toHaveBeenCalledTimes(2)
  })

  it('calls onEdit when card body is clicked in grid mode', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    render(<NoteCard note={mockNote} viewMode="grid" onDelete={onDelete} onEdit={onEdit} />)

    const card = screen.getByRole('button', { name: `Edit note: ${mockNote.title}` })
    fireEvent.click(card)

    expect(onEdit).toHaveBeenCalledWith(mockNote)
  })

  it('shows "No content" placeholder when note has no content', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    const emptyNote = { ...mockNote, content: '' }
    render(<NoteCard note={emptyNote} viewMode="grid" onDelete={onDelete} onEdit={onEdit} />)

    expect(screen.getByText('No content')).toBeInTheDocument()
  })

  it('renders notes correctly when there are no tags', () => {
    const onDelete = vi.fn()
    const onEdit = vi.fn()
    const noteNoTags = { ...mockNote, tags: [] }
    render(<NoteCard note={noteNoTags} viewMode="grid" onDelete={onDelete} onEdit={onEdit} />)

    expect(screen.queryByText(/#/)).not.toBeInTheDocument()
  })
})
