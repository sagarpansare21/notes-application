import { noteRepository } from "../repositories/note.repository";
import { NotFoundError, ValidationError, normalizeTags } from "../utils";
import { NoteDomain, GetNotesParams } from "../types";

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
      tags: normalizeTags(data.tags),
    });
  }

  async getNotes(params?: GetNotesParams) {
    if (params?.limit !== undefined && params?.offset !== undefined) {
      return noteRepository.pagination({
        limit: params.limit,
        offset: params.offset,
        search: params.search,
        tag: params.tag,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        onlyDeleted: params.onlyDeleted,
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
        onlyDeleted: params.onlyDeleted,
      });
    }

    // If only filtering by tag is requested
    if (params?.tag && !params.search) {
      return noteRepository.filterByTag(params.tag, {
        limit: params.limit,
        offset: params.offset,
        onlyDeleted: params.onlyDeleted,
      });
    }

    // If only searching is requested
    if (params?.search && !params.tag) {
      return noteRepository.search(params.search, {
        limit: params.limit,
        offset: params.offset,
        onlyDeleted: params.onlyDeleted,
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
    if (!note || note.deletedAt) {
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

    const existing = await noteRepository.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Note not found");
    }

    if (data.title !== undefined && data.title.trim() === "") {
      throw new ValidationError("Title cannot be empty");
    }

    return noteRepository.update(id, {
      title: data.title ? data.title.trim() : undefined,
      content: data.content,
      tags: data.tags ? normalizeTags(data.tags) : undefined,
    });
  }

  async deleteNote(id: string): Promise<NoteDomain> {
    if (!id) {
      throw new ValidationError("ID is required");
    }

    const existing = await noteRepository.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundError("Note not found");
    }

    return noteRepository.delete(id);
  }

  async exportNotes(format: string): Promise<string> {
    const normalizedFormat = format.trim().toLowerCase();
    if (normalizedFormat !== "json" && normalizedFormat !== "markdown") {
      throw new ValidationError("Unsupported export format");
    }

    const notes = await noteRepository.findAll();

    if (normalizedFormat === "json") {
      const notesJson = notes.map((n) => ({
        title: n.title,
        content: n.content,
        tags: n.tags,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      }));
      return JSON.stringify(notesJson, null, 2);
    } else {
      const md = notes
        .map((n) => {
          const tagLines = n.tags.map((t) => `- ${t}`).join("\n");
          const tagsSection = tagLines ? `Tags:\n${tagLines}` : "Tags:";
          return `# ${n.title}\n\n${n.content}\n\n${tagsSection}\n\nCreated:\n${n.createdAt.toISOString()}\n\nUpdated:\n${n.updatedAt.toISOString()}\n\n---`;
        })
        .join("\n\n");
      return md;
    }
  }

  async importNotes(fileContent: string): Promise<{ imported: number; skipped: number; failed: number }> {
    let notes: any;
    try {
      notes = JSON.parse(fileContent);
    } catch {
      throw new ValidationError("Malformed JSON file");
    }

    if (!Array.isArray(notes)) {
      throw new ValidationError("JSON file must contain an array of notes");
    }

    let imported = 0;
    let skipped = 0;
    let failed = 0;

    for (const note of notes) {
      if (!note || typeof note !== "object") {
        failed++;
        continue;
      }
      const { title, content, tags } = note;
      if (!title || typeof title !== "string" || title.trim() === "") {
        failed++;
        continue;
      }
      if (content === undefined || content === null || typeof content !== "string") {
        failed++;
        continue;
      }
      if (tags !== undefined) {
        if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string")) {
          failed++;
          continue;
        }
      }

      try {
        const normalizedTags = normalizeTags(tags || []);
        const result = await noteRepository.importNote({
          title: title.trim(),
          content: content,
          tags: normalizedTags,
        });
        if (result === "imported") {
          imported++;
        } else {
          skipped++;
        }
      } catch {
        failed++;
      }
    }

    return { imported, skipped, failed };
  }

  async getTrashNotes(params: GetNotesParams = {}) {
    return this.getNotes({ ...params, onlyDeleted: true });
  }

  async restoreNote(id: string): Promise<NoteDomain> {
    if (!id) {
      throw new ValidationError("ID is required");
    }
    const existing = await noteRepository.findById(id, true);
    if (!existing) {
      throw new NotFoundError("Note not found");
    }
    if (!existing.deletedAt) {
      throw new ValidationError("Note is not in trash");
    }
    return noteRepository.restore(id);
  }

  async permanentDeleteNote(id: string): Promise<NoteDomain> {
    if (!id) {
      throw new ValidationError("ID is required");
    }
    const existing = await noteRepository.findById(id, true);
    if (!existing) {
      throw new NotFoundError("Note not found");
    }
    if (!existing.deletedAt) {
      throw new ValidationError("Note is not in trash");
    }
    return noteRepository.hardDelete(id);
  }

  async emptyTrash(): Promise<number> {
    return noteRepository.emptyTrash();
  }
}
export const noteService = new NoteService();
