import { api } from '@/lib/axios'
import type { Note, CreateNoteInput } from '@/types/note'

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const response = await api.post<{ success: boolean; message: string; data: Note }>('/v1/notes', input)
  return response.data.data
}
