import { describe, it, expect, vi } from 'vitest'
import { createNote } from './note-api'
import { api } from '@/lib/axios'

vi.mock('@/lib/axios', () => {
  return {
    api: {
      post: vi.fn(),
    },
  }
})

describe('note-api', () => {
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
