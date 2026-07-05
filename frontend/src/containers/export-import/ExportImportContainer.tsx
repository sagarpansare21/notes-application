import React, { useState, useRef } from 'react'
import { useImportNotes } from '@/hooks/use-import-notes'
import { useExportNotes } from '@/hooks/useExportNotes'
import { ExportImportPanel } from '@/components/presentational/export-import'

export function ExportImportContainer() {
  const [isDragActive, setIsDragActive] = useState(false)
  const [importProgress] = useState(0)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [importedStats, setImportedStats] = useState<{ imported: number; skipped: number; failed: number } | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const importNotesMutation = useImportNotes()
  const { isExporting, exportNotes } = useExportNotes()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!importNotesMutation.isPending) {
      setIsDragActive(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragActive(false)
  }

  const processFile = (file: File) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setImportError('Invalid file type. Only JSON files are accepted.')
      setImportSuccess(false)
      setImportedStats(null)
      return
    }

    setImportError(null)
    setImportSuccess(false)
    setImportedStats(null)

    importNotesMutation.mutate(file, {
      onSuccess: (data) => {
        setImportSuccess(true)
        setImportedStats(data)
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Failed to import notes. Make sure the JSON format matches note records schema.'
        setImportError(msg)
      },
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (importNotesMutation.isPending) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  return (
    <ExportImportPanel
      isDragActive={isDragActive}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onFileSelect={handleFileSelect}
      fileInputRef={fileInputRef}
      importProgress={importProgress}
      isImporting={importNotesMutation.isPending || (importProgress > 0 && importProgress < 100)}
      importError={importError}
      importSuccess={importSuccess}
      importedStats={importedStats}
      isExporting={isExporting}
      onExport={exportNotes}
    />
  )
}
