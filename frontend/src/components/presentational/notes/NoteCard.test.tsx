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
    render(<NoteCard note={mockNote} viewMode="grid" onDelete={onDelete} />)

    expect(screen.getByText('Test Note Title')).toBeInTheDocument()
    expect(screen.getByText(/Heading This is a simple markdown content/i)).toBeInTheDocument()
    expect(screen.getByText('#work')).toBeInTheDocument()
    expect(screen.getByText('#personal')).toBeInTheDocument()
  })

  it('renders note fields correctly in list mode', () => {
    const onDelete = vi.fn()
    render(<NoteCard note={mockNote} viewMode="list" onDelete={onDelete} />)

    expect(screen.getByText('Test Note Title')).toBeInTheDocument()
    expect(screen.getByText(/Heading This is a simple markdown content/i)).toBeInTheDocument()
  })

  it('calls onDelete callback when delete menu item is clicked', async () => {
    const onDelete = vi.fn()
    render(<NoteCard note={mockNote} viewMode="grid" onDelete={onDelete} />)

    const menuButtons = screen.getAllByRole('button')
    fireEvent.click(menuButtons[0])

    const deleteItem = screen.getByText(/Delete/i)
    expect(deleteItem).toBeInTheDocument()
    fireEvent.click(deleteItem)

    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
