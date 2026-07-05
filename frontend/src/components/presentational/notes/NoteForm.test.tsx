import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NoteForm } from './NoteForm'

describe('NoteForm', () => {
  it('renders all form fields and buttons', () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()

    render(<NoteForm onSubmit={onSubmit} onCancel={onCancel} />)

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Note/i })).toBeInTheDocument()
  })

  it('keeps submit button disabled initially because form is empty and invalid', () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()

    render(<NoteForm onSubmit={onSubmit} onCancel={onCancel} />)

    const submitBtn = screen.getByRole('button', { name: /Create Note/i })
    expect(submitBtn).toBeDisabled()
  })

  it('enables submit button and calls onSubmit when form is filled and submitted', async () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()

    render(<NoteForm onSubmit={onSubmit} onCancel={onCancel} />)

    const titleInput = screen.getByLabelText(/Title/i)
    const contentTextarea = screen.getByPlaceholderText(/Write note contents in markdown.../i)

    fireEvent.change(titleInput, { target: { value: 'My Test Note' } })
    fireEvent.change(contentTextarea, { target: { value: 'This is test content.' } })

    const submitBtn = screen.getByRole('button', { name: /Create Note/i })

    await waitFor(() => {
      expect(submitBtn).toBeEnabled()
    })

    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'My Test Note',
        content: 'This is test content.',
        tags: [],
      })
    })
  })

  it('triggers validation errors on blur for empty fields', async () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()

    render(<NoteForm onSubmit={onSubmit} onCancel={onCancel} />)

    const titleInput = screen.getByLabelText(/Title/i)

    fireEvent.focus(titleInput)
    fireEvent.blur(titleInput)

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument()
    })
  })

  it('disables cancel button and shows loading state on submit button when isLoading is true', () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()

    render(<NoteForm onSubmit={onSubmit} onCancel={onCancel} isLoading={true} />)

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    expect(cancelBtn).toBeDisabled()

    const submitBtn = screen.getByRole('button', { name: /Create Note/i })
    expect(submitBtn).toBeDisabled()
  })

  it('supports adding and removing tags', async () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()

    render(<NoteForm onSubmit={onSubmit} onCancel={onCancel} />)

    const tagsInput = screen.getByLabelText(/Tags/i)

    // 1. Add tag "work"
    fireEvent.change(tagsInput, { target: { value: 'work' } })
    fireEvent.keyDown(tagsInput, { key: 'Enter', code: 'Enter' })

    expect(screen.getByText('work')).toBeInTheDocument()
    expect(tagsInput).toHaveValue('')

    // 2. Add tag "personal"
    fireEvent.change(tagsInput, { target: { value: 'personal' } })
    fireEvent.keyDown(tagsInput, { key: 'Enter', code: 'Enter' })

    expect(screen.getByText('personal')).toBeInTheDocument()

    // 3. Try to add duplicate tag "work"
    fireEvent.change(tagsInput, { target: { value: 'work' } })
    fireEvent.keyDown(tagsInput, { key: 'Enter', code: 'Enter' })

    const workTags = screen.getAllByText('work')
    expect(workTags).toHaveLength(1) // Should not duplicate

    // 4. Remove tag "work" (first × button)
    const removeButtons = screen.getAllByRole('button', { name: '×' })
    fireEvent.click(removeButtons[0])

    expect(screen.queryByText('work')).not.toBeInTheDocument()
    expect(screen.getByText('personal')).toBeInTheDocument()
  })
})
