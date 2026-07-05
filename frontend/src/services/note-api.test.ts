import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getNotes, getTags, createNote, deleteNote, exportNotes } from './note-api'
import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => {
  return {
    api: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    },
  }
})

describe('note-api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getNotes', () => {
    const mockNotesList = [
      {
        id: '1',
        title: 'Note 1',
        content: 'Content 1',
        tags: [],
        createdAt: '2026-07-05T00:00:00.000Z',
        updatedAt: '2026-07-05T00:00:00.000Z',
        deletedAt: null,
      },
    ]

    it('returns array when backend returns non-paginated data', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockNotesList,
        },
      })

      const result = await getNotes({ search: 'query' })

      expect(api.get).toHaveBeenCalledWith('/v1/notes', { params: { search: 'query' } })
      expect(result).toEqual({ data: mockNotesList, total: 1, limit: 1, offset: 0 })
    })

    it('returns standard array when backend returns paginated data', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: mockNotesList,
            total: 1,
            limit: 10,
            offset: 0,
          },
        },
      })

      const result = await getNotes()

      expect(api.get).toHaveBeenCalledWith('/v1/notes', { params: undefined })
      expect(result).toEqual({ data: mockNotesList, total: 1, limit: 10, offset: 0 })
    })

    it('returns empty array fallback when data is null/missing', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: null,
        },
      })

      const result = await getNotes()
      expect(result).toEqual({ data: [], total: 0, limit: 0, offset: 0 })
    })

    it('returns empty array when backend returns data object but its nested data is not an array', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: {
            data: 'not-an-array',
          },
        },
      })

      const result = await getNotes()
      expect(result).toEqual({ data: [], total: 0, limit: 0, offset: 0 })
    })
  })

  describe('getTags', () => {
    it('calls api.get and returns tags array', async () => {
      const mockTags = [
        { id: '1', name: 'tag1' },
        { id: '2', name: 'tag2' },
      ]

      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: mockTags,
        },
      })

      const result = await getTags()

      expect(api.get).toHaveBeenCalledWith('/v1/tags')
      expect(result).toEqual(mockTags)
    })

    it('returns empty array fallback if tags are null/missing', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          message: 'Success',
          data: null,
        },
      })

      const result = await getTags()
      expect(result).toEqual([])
    })
  })

  describe('createNote', () => {
    it('calls api.post with correct endpoint and returns note data', async () => {
      const mockNote = {
        id: '1',
        title: 'Test Title',
        content: 'Test Content',
        tags: [],
        createdAt: '2026-07-05T00:00:00.000Z',
        updatedAt: '2026-07-05T00:00:00.000Z',
        deletedAt: null,
      }

      vi.mocked(api.post).mockResolvedValue({
        data: {
          success: true,
          message: 'Note created successfully',
          data: mockNote,
        },
      })

      const input = { title: 'Test Title', content: 'Test Content', tags: [] }
      const result = await createNote(input)

      expect(api.post).toHaveBeenCalledWith('/v1/notes', input)
      expect(result).toEqual(mockNote)
    })
  })

  describe('deleteNote', () => {
    it('calls api.delete with note ID', async () => {
      vi.mocked(api.delete).mockResolvedValue({
        data: { success: true },
      })

      await deleteNote('123')

      expect(api.delete).toHaveBeenCalledWith('/v1/notes/123')
    })
  })

  describe('exportNotes', () => {
    it('calls api.get with export endpoint and format, returning a blob', async () => {
      const mockBlob = new Blob(['notes content'], { type: 'text/markdown' })

      vi.mocked(api.get).mockResolvedValue({
        data: mockBlob,
      })

      const result = await exportNotes('markdown')

      expect(api.get).toHaveBeenCalledWith('/v1/notes/export', {
        params: { format: 'markdown' },
        responseType: 'blob',
      })
      expect(result).toEqual(mockBlob)
    })
  })
})
