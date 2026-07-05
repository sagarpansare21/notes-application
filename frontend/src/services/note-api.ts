import { api } from '@/lib/axios'
import type { Note, CreateNoteInput, PaginatedNotes } from '@/types/note'

export interface GetNotesParams {
  search?: string
  tag?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export async function getNotes(params?: GetNotesParams): Promise<PaginatedNotes> {
  const response = await api.get<{ success: boolean; message: string; data: Note[] | PaginatedNotes }>('/v1/notes', { params })
  const result = response.data.data
  if (result && 'data' in result && Array.isArray(result.data)) {
    return {
      data: result.data,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    }
  }
  const notes = Array.isArray(result) ? result : []
  return {
    data: notes,
    total: notes.length,
    limit: notes.length,
    offset: 0,
  }
}

export async function getTags(): Promise<Array<{ id: string; name: string }>> {
  const response = await api.get<{ success: boolean; message: string; data: Array<{ id: string; name: string }> }>('/v1/tags')
  return response.data.data || []
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const response = await api.post<{ success: boolean; message: string; data: Note }>('/v1/notes', input)
  return response.data.data
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/v1/notes/${id}`)
}

export async function exportNotes(format: 'json' | 'markdown'): Promise<Blob> {
  const response = await api.get(`/v1/notes/export`, {
    params: { format },
    responseType: 'blob',
  })
  return response.data
}
