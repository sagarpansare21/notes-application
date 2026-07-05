import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NotesToolbar } from './NotesToolbar'

describe('NotesToolbar', () => {
  const defaultProps = {
    search: '',
    onSearchChange: vi.fn(),
    selectedTag: '',
    onTagChange: vi.fn(),
    availableTags: [
      { id: '1', name: 'work' },
      { id: '2', name: 'personal' },
    ],
    sortBy: 'updatedAt',
    onSortByChange: vi.fn(),
    sortOrder: 'desc' as const,
    onSortOrderChange: vi.fn(),
    viewMode: 'grid' as const,
    onViewModeChange: vi.fn(),
    onExport: vi.fn(),
    isExporting: false,
    onAddNoteClick: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all control components and inputs', () => {
    render(<NotesToolbar {...defaultProps} />)

    expect(screen.getByPlaceholderText(/Search notes.../i)).toBeInTheDocument()
    expect(screen.getByText('All tags')).toBeInTheDocument()
    expect(screen.getByText('Updated Time')).toBeInTheDocument()
    expect(screen.getByText('Add Note')).toBeInTheDocument()
  })

  it('debounces search inputs and triggers onSearchChange', async () => {
    render(<NotesToolbar {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(/Search notes.../i)
    fireEvent.change(searchInput, { target: { value: 'learn react' } })

    expect(defaultProps.onSearchChange).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('learn react')
    }, { timeout: 1000 })
  })

  it('triggers onSortOrderChange when order toggle button is clicked', () => {
    render(<NotesToolbar {...defaultProps} />)

    const toggleButton = screen.getByTitle('Sort Descending')
    fireEvent.click(toggleButton)

    expect(defaultProps.onSortOrderChange).toHaveBeenCalledWith('asc')
  })

  it('triggers onViewModeChange when list mode button is clicked', () => {
    render(<NotesToolbar {...defaultProps} />)

    const listBtn = screen.getByTitle('List View')
    fireEvent.click(listBtn)

    expect(defaultProps.onViewModeChange).toHaveBeenCalledWith('list')
  })

  it('triggers onAddNoteClick when Add Note button is clicked', () => {
    render(<NotesToolbar {...defaultProps} />)

    const addBtn = screen.getByRole('button', { name: /Add Note/i })
    fireEvent.click(addBtn)

    expect(defaultProps.onAddNoteClick).toHaveBeenCalled()
  })

  it('does not render Add Note button when onAddNoteClick is not provided', () => {
    const { onAddNoteClick: _omitted, ...propsWithoutAdd } = defaultProps
    render(<NotesToolbar {...propsWithoutAdd} />)

    expect(screen.queryByRole('button', { name: /Add Note/i })).not.toBeInTheDocument()
  })

  it('triggers onViewModeChange with "grid" when grid button is clicked', () => {
    render(<NotesToolbar {...defaultProps} viewMode="list" />)

    const gridBtn = screen.getByTitle('Grid View')
    fireEvent.click(gridBtn)

    expect(defaultProps.onViewModeChange).toHaveBeenCalledWith('grid')
  })

  it('opens export dropdown and calls onExport with json', () => {
    render(<NotesToolbar {...defaultProps} />)

    const exportBtn = screen.getByRole('button', { name: /Export/i })
    fireEvent.click(exportBtn)

    const jsonItem = screen.getByText(/Export as JSON/i)
    fireEvent.click(jsonItem)

    expect(defaultProps.onExport).toHaveBeenCalledWith('json')
  })

  it('opens export dropdown and calls onExport with markdown', () => {
    render(<NotesToolbar {...defaultProps} />)

    const exportBtn = screen.getByRole('button', { name: /Export/i })
    fireEvent.click(exportBtn)

    const mdItem = screen.getByText(/Export as Markdown/i)
    fireEvent.click(mdItem)

    expect(defaultProps.onExport).toHaveBeenCalledWith('markdown')
  })

  it('toggles sort order from asc to desc', () => {
    render(<NotesToolbar {...defaultProps} sortOrder="asc" />)

    const toggleButton = screen.getByTitle('Sort Ascending')
    fireEvent.click(toggleButton)

    expect(defaultProps.onSortOrderChange).toHaveBeenCalledWith('desc')
  })

  it('syncs localSearch state when external search prop changes', async () => {
    const { rerender } = render(<NotesToolbar {...defaultProps} search="" />)

    rerender(<NotesToolbar {...defaultProps} search="updated" />)

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search notes.../i)
      expect(searchInput).toHaveValue('updated')
    })
  })
})
