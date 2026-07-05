import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EditNoteDrawer } from './EditNoteDrawer'
import type { Note } from '@/types/note'

describe('EditNoteDrawer', () => {
  const mockNote: Note = {
    id: 'note-123',
    title: 'Initial Title',
    content: 'Initial Content',
    tags: ['react', 'test'],
    createdAt: '2026-07-05T00:00:00.000Z',
    updatedAt: '2026-07-05T00:00:00.000Z',
  }

  it('renders null when note is null', () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()
    const onAutoSave = vi.fn()

    const { container } = render(
      <EditNoteDrawer
        open={true}
        note={null}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onAutoSave={onAutoSave}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders drawer header and prefilled form fields when open is true and note is provided', () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()
    const onAutoSave = vi.fn()

    render(
      <EditNoteDrawer
        open={true}
        note={mockNote}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onAutoSave={onAutoSave}
      />
    )

    expect(screen.getByRole('heading', { name: 'Edit Note' })).toBeInTheDocument()
    expect(screen.getByText(/Changes are saved automatically as you type/i)).toBeInTheDocument()

    const titleInput = screen.getByLabelText(/Title/i)
    expect(titleInput).toHaveValue('Initial Title')

    const contentEditor = screen.getByRole('textbox', { name: /content/i })
    expect(contentEditor).toHaveValue('Initial Content')

    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('calls onOpenChange(false) when cancel button is clicked', () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()
    const onAutoSave = vi.fn()

    render(
      <EditNoteDrawer
        open={true}
        note={mockNote}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onAutoSave={onAutoSave}
      />
    )

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelBtn)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('submits updated values when submit is clicked', async () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()
    const onAutoSave = vi.fn()

    render(
      <EditNoteDrawer
        open={true}
        note={mockNote}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onAutoSave={onAutoSave}
      />
    )

    const titleInput = screen.getByLabelText(/Title/i)
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i })

    await waitFor(() => {
      expect(saveBtn).not.toBeDisabled()
    })

    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Updated Title',
        content: 'Initial Content',
        tags: ['react', 'test'],
      })
    })
  })

  it('triggers onAutoSave when changes are typed', async () => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()
    const onAutoSave = vi.fn()

    render(
      <EditNoteDrawer
        open={true}
        note={mockNote}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onAutoSave={onAutoSave}
      />
    )

    const titleInput = screen.getByLabelText(/Title/i)
    fireEvent.change(titleInput, { target: { value: 'Autosave Title' } })

    // Fast-forward timers to exceed 800ms debounce
    act(() => {
      vi.advanceTimersByTime(850)
    })

    expect(onAutoSave).toHaveBeenCalledWith({
      title: 'Autosave Title',
      content: 'Initial Content',
      tags: ['react', 'test'],
    })

    vi.useRealTimers()
  })

  it('displays the correct autosave status label', () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()
    const onAutoSave = vi.fn()

    const { rerender } = render(
      <EditNoteDrawer
        open={true}
        note={mockNote}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onAutoSave={onAutoSave}
        autoSaveStatus="saving"
      />
    )
    expect(screen.getByText('Saving…')).toBeInTheDocument()

    rerender(
      <EditNoteDrawer
        open={true}
        note={mockNote}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onAutoSave={onAutoSave}
        autoSaveStatus="saved"
      />
    )
    expect(screen.getByText('✓ Saved')).toBeInTheDocument()

    rerender(
      <EditNoteDrawer
        open={true}
        note={mockNote}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        onAutoSave={onAutoSave}
        autoSaveStatus="error"
      />
    )
    expect(screen.getByText('⚠ Save failed')).toBeInTheDocument()
  })
})
