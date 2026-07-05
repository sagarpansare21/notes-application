import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useExportNotes } from './useExportNotes'
import { exportNotes } from '@/services/note-api'
import { toast } from '@/components/ui/shadcn/toast'

vi.mock('@/services/note-api', () => ({
  exportNotes: vi.fn(),
}))

vi.mock('@/components/ui/shadcn/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useExportNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.URL.createObjectURL = vi.fn().mockReturnValue('mock-url')
    window.URL.revokeObjectURL = vi.fn()
  })

  it('triggers export and download correctly', async () => {
    const mockBlob = new Blob(['notes content'], { type: 'application/json' })
    vi.mocked(exportNotes).mockResolvedValue(mockBlob)

    const { result } = renderHook(() => useExportNotes())

    expect(result.current.isExporting).toBe(false)

    act(() => {
      result.current.exportNotes('json')
    })

    expect(result.current.isExporting).toBe(true)

    await waitFor(() => {
      expect(result.current.isExporting).toBe(false)
    })

    expect(exportNotes).toHaveBeenCalledWith('json')
    expect(toast.success).toHaveBeenCalledWith('Notes successfully exported as JSON')
  })

  it('handles export errors gracefully', async () => {
    vi.mocked(exportNotes).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useExportNotes())

    act(() => {
      result.current.exportNotes('markdown')
    })

    await waitFor(() => {
      expect(result.current.isExporting).toBe(false)
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to export notes')
  })
})
