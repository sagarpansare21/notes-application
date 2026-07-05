export interface Tag {
  id: string
  name: string
}

export interface Note {
  id: string
  title: string
  content: string
  tags: Tag[]
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface CreateNoteInput {
  title: string
  content: string
  tags?: string[]
}
