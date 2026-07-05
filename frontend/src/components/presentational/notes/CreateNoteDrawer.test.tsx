import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CreateNoteDrawer } from './CreateNoteDrawer'

describe('CreateNoteDrawer', () => {
  let confirmMock: MockInstance

  beforeEach(() => {
    confirmMock = vi.spyOn(window, 'confirm')
  })

  afterEach(() => {
    confirmMock.mockRestore()
  })

  it('renders drawer header and form fields when open is true', () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()

    render(
      <CreateNoteDrawer open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />
    )

    expect(screen.getByRole('heading', { name: 'Create Note' })).toBeInTheDocument()
    expect(screen.getByText(/Specify a title, write body content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
  })

  it('triggers onOpenChange(false) when cancel button is clicked on clean form', () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()

    render(
      <CreateNoteDrawer open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />
    )

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelBtn)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not trigger onOpenChange(false) when cancel button is clicked and isLoading is true', () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()

    render(
      <CreateNoteDrawer open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} isLoading={true} />
    )

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelBtn)

    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('prompts window.confirm when form is dirty and close is requested', async () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn()

    render(
      <CreateNoteDrawer open={true} onOpenChange={onOpenChange} onSubmit={onSubmit} />
    )

    const titleInput = screen.getByLabelText(/Title/i)
    fireEvent.change(titleInput, { target: { value: 'Dirty value' } })

    // Yield to let React Hook Form register the change and run validation
    await waitFor(() => {
      expect(titleInput).toHaveValue('Dirty value')
    })
    // Give RHF's useEffect a tick to run onDirtyChange(true)
    await new Promise((resolve) => setTimeout(resolve, 50))

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i })

    // Case 1: confirm returns false (do not close)
    confirmMock.mockReturnValue(false)
    fireEvent.click(cancelBtn)
    expect(confirmMock).toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()

    // Case 2: confirm returns true (close form)
    confirmMock.mockReturnValue(true)
    fireEvent.click(cancelBtn)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
