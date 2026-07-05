import { noteService } from "../services";
import { successResponse, ValidationError } from "../utils";

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

  async exportNotes(request: any, reply: any) {
    const format = request.query.format || "json";
    const content = await noteService.exportNotes(String(format));

    const filename = format === "markdown" ? "notes.md" : "notes.json";
    const contentType = format === "markdown" ? "text/markdown" : "application/json";

    return reply
      .status(200)
      .header("Content-Disposition", `attachment; filename="${filename}"`)
      .header("Content-Type", contentType)
      .send(content);
  }

  async importNotes(request: any, reply: any) {
    const fileData = await request.file();
    if (!fileData) {
      throw new ValidationError("No file uploaded");
    }

    if (!fileData.filename.endsWith(".json")) {
      throw new ValidationError("Only JSON files are supported for import");
    }

    const buffer = await fileData.toBuffer();
    const fileContent = buffer.toString("utf-8");

    const summary = await noteService.importNotes(fileContent);

    return reply
      .status(200)
      .send(successResponse("Import completed.", summary));
  }

  async getTrashNotes(request: any, reply: any) {
    const { search, tag, limit, offset, sortBy, sortOrder } = request.query;

    const parsedLimit = limit !== undefined ? parseInt(String(limit), 10) : undefined;
    const parsedOffset = offset !== undefined ? parseInt(String(offset), 10) : undefined;

    const result = await noteService.getTrashNotes({
      search: search ? String(search) : undefined,
      tag: tag ? String(tag) : undefined,
      limit: isNaN(Number(parsedLimit)) ? undefined : parsedLimit,
      offset: isNaN(Number(parsedOffset)) ? undefined : parsedOffset,
      sortBy: sortBy ? String(sortBy) : undefined,
      sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
    });

    return reply.status(200).send(successResponse("Trash notes retrieved successfully", result));
  }

  async restoreNote(request: any, reply: any) {
    const { id } = request.params;
    const note = await noteService.restoreNote(id);
    return reply.status(200).send(successResponse("Note restored successfully", note));
  }

  async permanentDeleteNote(request: any, reply: any) {
    const { id } = request.params;
    const note = await noteService.permanentDeleteNote(id);
    return reply.status(200).send(successResponse("Note permanently deleted successfully", note));
  }

  async emptyTrash(request: any, reply: any) {
    const count = await noteService.emptyTrash();
    return reply.status(200).send(successResponse("Trash emptied successfully", { count }));
  }
}

export const noteController = new NoteController();
