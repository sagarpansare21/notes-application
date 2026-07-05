export interface Tag {
  id: string
  name: string
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface CreateNoteInput {
  title: string
  content: string
  tags?: string[]
}

export interface PaginatedNotes {
  data: Note[]
  total: number
  limit: number
  offset: number
}
