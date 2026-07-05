import { useState } from 'react'
import { exportNotes } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'

export function useExportNotes() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'json' | 'markdown') => {
    setIsExporting(true)
    try {
      const blob = await exportNotes(format)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', format === 'json' ? 'notes.json' : 'notes.md')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success(`Notes successfully exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Failed to export notes')
    } finally {
      setIsExporting(false)
    }
  }

  return {
    isExporting,
    exportNotes: handleExport,
  }
}
