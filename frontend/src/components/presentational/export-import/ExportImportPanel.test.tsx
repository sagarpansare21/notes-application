import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ExportImportPanel } from './ExportImportPanel'

describe('ExportImportPanel', () => {
  const defaultProps = {
    isDragActive: false,
    onDragOver: vi.fn(),
    onDragLeave: vi.fn(),
    onDrop: vi.fn(),
    onFileSelect: vi.fn(),
    fileInputRef: { current: null },
    importProgress: 0,
    isImporting: false,
    importError: null,
    importSuccess: false,
    importedStats: null,
    isExporting: false,
    onExport: vi.fn(),
  }

  it('renders panels correctly', () => {
    render(<ExportImportPanel {...defaultProps} />)

    expect(screen.getByText('Import Notes')).toBeInTheDocument()
    expect(screen.getByText('Export Notes')).toBeInTheDocument()
    expect(screen.getByText('Drag and drop your export file here')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /JSON/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Markdown/i })).toBeInTheDocument()
  })

  it('renders progress bar when importing is active', () => {
    render(
      <ExportImportPanel
        {...defaultProps}
        isImporting={true}
        importProgress={45}
      />
    )

    expect(screen.getByText('Uploading and parsing notes...')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('displays error banner when importError is provided', () => {
    render(
      <ExportImportPanel
        {...defaultProps}
        importError="Malformed JSON file structure"
      />
    )

    expect(screen.getByText('Import Failed')).toBeInTheDocument()
    expect(screen.getByText('Malformed JSON file structure')).toBeInTheDocument()
  })

  it('displays success stats banner on successful import', () => {
    const stats = { imported: 12, skipped: 1, failed: 0 }
    render(
      <ExportImportPanel
        {...defaultProps}
        importSuccess={true}
        importedStats={stats}
      />
    )

    expect(screen.getByText('Import Successful')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls onExport with correct format when buttons are clicked', () => {
    const onExport = vi.fn()
    render(<ExportImportPanel {...defaultProps} onExport={onExport} />)

    const jsonBtn = screen.getByRole('button', { name: /JSON/i })
    fireEvent.click(jsonBtn)
    expect(onExport).toHaveBeenCalledWith('json')

    const mdBtn = screen.getByRole('button', { name: /Markdown/i })
    fireEvent.click(mdBtn)
    expect(onExport).toHaveBeenCalledWith('markdown')
  })
})
