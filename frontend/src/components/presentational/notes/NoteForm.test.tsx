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

  it('renders available tags autocomplete options and filters out active tags', async () => {
    const onSubmit = vi.fn()
    const availableTags = ['ideas', 'shopping', 'work']
    const initialValues = { title: '', content: '', tags: ['work'] }

    render(
      <NoteForm
        onSubmit={onSubmit}
        availableTags={availableTags}
        initialValues={initialValues}
      />
    )

    const tagsInput = screen.getByLabelText(/Tags/i)

    // Suggestion list should not render until focused and has text input
    expect(screen.queryByTestId('tags-suggestions-list')).not.toBeInTheDocument()

    // Focus input and type 'i'
    fireEvent.focus(tagsInput)
    fireEvent.change(tagsInput, { target: { value: 'i' } })

    // Verify popover is visible
    expect(screen.getByTestId('tags-suggestions-list')).toBeInTheDocument()

    // Should list 'ideas' and 'shopping' (contains 'i' and not 'work')
    const options = screen.getAllByRole('listitem')
    expect(options).toHaveLength(2)

    expect(screen.getByText('ideas')).toBeInTheDocument()
    expect(screen.getByText('shopping')).toBeInTheDocument()
    expect(screen.queryByTestId('tag-suggestion-work')).not.toBeInTheDocument() // 'work' is already active

    // Select 'ideas' option
    fireEvent.click(screen.getByText('ideas'))

    // Verify 'ideas' is now added to active tags
    await waitFor(() => {
      expect(screen.getByText('ideas')).toBeInTheDocument()
      expect(tagsInput).toHaveValue('')
    })
  })

  it('navigates suggestions with ArrowDown and selects on Enter', async () => {
    const onSubmit = vi.fn()
    const availableTags = ['alpha', 'beta', 'gamma']

    render(<NoteForm onSubmit={onSubmit} availableTags={availableTags} />)

    const tagsInput = screen.getByLabelText(/Tags/i)
    fireEvent.focus(tagsInput)
    fireEvent.change(tagsInput, { target: { value: 'a' } })

    // suggestions should be visible now
    await waitFor(() => {
      expect(screen.getByTestId('tags-suggestions-list')).toBeInTheDocument()
    })

    // ArrowDown highlights next item
    fireEvent.keyDown(tagsInput, { key: 'ArrowDown' })

    // Enter selects the highlighted suggestion
    fireEvent.keyDown(tagsInput, { key: 'Enter' })

    // Tag input should be cleared after selection
    await waitFor(() => {
      expect(tagsInput).toHaveValue('')
    })
  })

  it('navigates suggestions with ArrowUp', async () => {
    const onSubmit = vi.fn()
    const availableTags = ['alpha', 'beta', 'gamma']

    render(<NoteForm onSubmit={onSubmit} availableTags={availableTags} />)

    const tagsInput = screen.getByLabelText(/Tags/i)
    fireEvent.focus(tagsInput)
    fireEvent.change(tagsInput, { target: { value: 'a' } })

    await waitFor(() => {
      expect(screen.getByTestId('tags-suggestions-list')).toBeInTheDocument()
    })

    // ArrowUp wraps around
    fireEvent.keyDown(tagsInput, { key: 'ArrowUp' })

    // Suggestions should still be visible
    expect(screen.getByTestId('tags-suggestions-list')).toBeInTheDocument()
  })

  it('closes suggestion list on Escape key', async () => {
    const onSubmit = vi.fn()
    const availableTags = ['alpha', 'beta']

    render(<NoteForm onSubmit={onSubmit} availableTags={availableTags} />)

    const tagsInput = screen.getByLabelText(/Tags/i)
    fireEvent.focus(tagsInput)
    fireEvent.change(tagsInput, { target: { value: 'a' } })

    await waitFor(() => {
      expect(screen.getByTestId('tags-suggestions-list')).toBeInTheDocument()
    })

    fireEvent.keyDown(tagsInput, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByTestId('tags-suggestions-list')).not.toBeInTheDocument()
    })
  })

  it('adds tag by typing and pressing Enter when no suggestion is highlighted', async () => {
    const onSubmit = vi.fn()

    render(<NoteForm onSubmit={onSubmit} />)

    const tagsInput = screen.getByLabelText(/Tags/i)
    fireEvent.change(tagsInput, { target: { value: 'mytag' } })
    fireEvent.keyDown(tagsInput, { key: 'Enter' })

    expect(screen.getByText('mytag')).toBeInTheDocument()
    expect(tagsInput).toHaveValue('')
  })
})
