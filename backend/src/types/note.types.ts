export interface NoteDomain {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface GetNotesParams {
  search?: string;
  tag?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onlyDeleted?: boolean;
}
