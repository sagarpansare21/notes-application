import { noteRepository, NoteDomain } from "../repositories/note.repository";
import { NotFoundError, ValidationError } from "../utils";

export class NoteService {
  async createNote(data: { title: string; content: string; tags?: string[] }): Promise<NoteDomain> {
    if (!data.title || data.title.trim() === "") {
      throw new ValidationError("Title is required");
    }
    if (data.content === undefined || data.content === null) {
      throw new ValidationError("Content is required");
    }
    return noteRepository.create({
      title: data.title.trim(),
      content: data.content,
      tags: data.tags,
    });
  }

  async getNotes(params?: {
    search?: string;
    tag?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    // If limit and offset are provided, perform pagination
    if (params?.limit !== undefined && params?.offset !== undefined) {
      return noteRepository.pagination({
        limit: params.limit,
        offset: params.offset,
        search: params.search,
        tag: params.tag,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      });
    }

    // If sorting is requested
    if (params?.sortBy) {
      return noteRepository.sorting({
        sortBy: params.sortBy,
        sortOrder: params.sortOrder || "desc",
        search: params.search,
        tag: params.tag,
        limit: params.limit,
        offset: params.offset,
      });
    }

    // If only filtering by tag is requested
    if (params?.tag && !params.search) {
      return noteRepository.filterByTag(params.tag, {
        limit: params.limit,
        offset: params.offset,
      });
    }

    // If only searching is requested
    if (params?.search && !params.tag) {
      return noteRepository.search(params.search, {
        limit: params.limit,
        offset: params.offset,
      });
    }

    // Default findAll
    return noteRepository.findAll(params);
  }

  async getNote(id: string): Promise<NoteDomain> {
    if (!id) {
      throw new ValidationError("ID is required");
    }
    const note = await noteRepository.findById(id);
    if (!note) {
      throw new NotFoundError("Note not found");
    }
    return note;
  }

  async updateNote(
    id: string,
    data: { title?: string; content?: string; tags?: string[] }
  ): Promise<NoteDomain> {
    if (!id) {
      throw new ValidationError("ID is required");
    }

    // Check if exists
    const existing = await noteRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Note not found");
    }

    // Validate inputs if provided
    if (data.title !== undefined && data.title.trim() === "") {
      throw new ValidationError("Title cannot be empty");
    }

    return noteRepository.update(id, {
      title: data.title ? data.title.trim() : undefined,
      content: data.content,
      tags: data.tags,
    });
  }

  async deleteNote(id: string): Promise<NoteDomain> {
    if (!id) {
      throw new ValidationError("ID is required");
    }

    // Check if exists
    const existing = await noteRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Note not found");
    }

    return noteRepository.delete(id);
  }
}

export const noteService = new NoteService();
