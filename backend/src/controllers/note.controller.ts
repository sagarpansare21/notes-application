import { noteService } from "../services";
import { successResponse } from "../utils";

export class NoteController {
  async createNote(request: any, reply: any) {
    const { title, content, tags } = request.body;
    const note = await noteService.createNote({ title, content, tags });
    return reply.status(201).send(successResponse("Note created successfully", note));
  }

  async getNotes(request: any, reply: any) {
    const { search, tag, limit, offset, sortBy, sortOrder } = request.query;

    const parsedLimit = limit !== undefined ? parseInt(String(limit), 10) : undefined;
    const parsedOffset = offset !== undefined ? parseInt(String(offset), 10) : undefined;

    const result = await noteService.getNotes({
      search: search ? String(search) : undefined,
      tag: tag ? String(tag) : undefined,
      limit: isNaN(Number(parsedLimit)) ? undefined : parsedLimit,
      offset: isNaN(Number(parsedOffset)) ? undefined : parsedOffset,
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
    });

    return reply.status(200).send(successResponse("Notes retrieved successfully", result));
  }

  async getNote(request: any, reply: any) {
    const { id } = request.params;
    const note = await noteService.getNote(id);
    return reply.status(200).send(successResponse("Note retrieved successfully", note));
  }

  async updateNote(request: any, reply: any) {
    const { id } = request.params;
    const { title, content, tags } = request.body;
    const note = await noteService.updateNote(id, { title, content, tags });
    return reply.status(200).send(successResponse("Note updated successfully", note));
  }

  async deleteNote(request: any, reply: any) {
    const { id } = request.params;
    const note = await noteService.deleteNote(id);
    return reply.status(200).send(successResponse("Note deleted successfully", note));
  }
}

export const noteController = new NoteController();
