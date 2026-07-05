import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ExportImportPage } from './export-import'
import { useImportNotes } from '@/hooks/use-import-notes'
import { useExportNotes } from '@/hooks/useExportNotes'

vi.mock('@/hooks/use-import-notes', () => ({
  useImportNotes: vi.fn(),
}))

vi.mock('@/hooks/useExportNotes', () => ({
  useExportNotes: vi.fn(),
}))

describe('ExportImportPage', () => {
  const mockImportMutate = vi.fn()
  const mockExport = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useImportNotes).mockReturnValue({
      mutate: mockImportMutate,
      isPending: false,
    } as any)

    vi.mocked(useExportNotes).mockReturnValue({
      isExporting: false,
      exportNotes: mockExport,
    } as any)
  })

  it('renders page layout header', () => {
    render(<ExportImportPage />)

    expect(screen.getByText('Export / Import')).toBeInTheDocument()
    expect(screen.getByText(/Transfer your notes data to local backups/i)).toBeInTheDocument()
  })

  it('handles export trigger clicks', () => {
    render(<ExportImportPage />)

    const jsonBtn = screen.getByRole('button', { name: /JSON/i })
    fireEvent.click(jsonBtn)
    expect(mockExport).toHaveBeenCalledWith('json')

    const mdBtn = screen.getByRole('button', { name: /Markdown/i })
    fireEvent.click(mdBtn)
    expect(mockExport).toHaveBeenCalledWith('markdown')
  })

  it('validates invalid file type drops', async () => {
    render(<ExportImportPage />)

    const dropArea = screen.getByText('Drag and drop your export file here').closest('div')
    expect(dropArea).not.toBeNull()

    const invalidFile = new File(['text'], 'notes.txt', { type: 'text/plain' })

    const event = new Event('drop', { bubbles: true })
    Object.defineProperty(event, 'dataTransfer', {
      value: {
        files: [invalidFile],
      },
    })

    fireEvent(dropArea!, event)

    await waitFor(() => {
      expect(screen.getByText('Invalid file type. Only JSON files are accepted.')).toBeInTheDocument()
      expect(mockImportMutate).not.toHaveBeenCalled()
    })
  })
})
