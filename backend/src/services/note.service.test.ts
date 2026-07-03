import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { noteService } from "./note.service";
import { prisma } from "../config/prisma";
import { ValidationError, NotFoundError } from "../utils";
import { NoteDomain } from "../types";

describe("NoteService", () => {
  beforeEach(async () => {
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a valid note", async () => {
    const note = await noteService.createNote({
      title: "Business Note",
      content: "Important business logic",
      tags: ["business"],
    });

    expect(note.id).toBeDefined();
    expect(note.title).toBe("Business Note");
    expect(note.content).toBe("Important business logic");
  });

  it("should fail to create a note with empty title", async () => {
    await expect(
      noteService.createNote({ title: "", content: "Content" })
    ).rejects.toThrow(ValidationError);

    await expect(
      noteService.createNote({ title: "   ", content: "Content" })
    ).rejects.toThrow(ValidationError);
  });

  it("should fail to create a note with missing content", async () => {
    await expect(
      noteService.createNote({ title: "Title", content: undefined as any })
    ).rejects.toThrow(ValidationError);
  });

  it("should fetch an existing note", async () => {
    const created = await noteService.createNote({
      title: "Get Me",
      content: "Secret content",
    });

    const retrieved = await noteService.getNote(created.id);
    expect(retrieved.id).toBe(created.id);
    expect(retrieved.title).toBe("Get Me");
  });

  it("should throw NotFoundError for non-existent note fetch", async () => {
    await expect(
      noteService.getNote("non-existent-uuid")
    ).rejects.toThrow(NotFoundError);
  });

  it("should update a note's fields", async () => {
    const created = await noteService.createNote({
      title: "Initial Title",
      content: "Initial Content",
    });

    const updated = await noteService.updateNote(created.id, {
      title: "Updated Title",
    });

    expect(updated.title).toBe("Updated Title");
    expect(updated.content).toBe("Initial Content");
  });

  it("should throw ValidationError when updating with empty title", async () => {
    const created = await noteService.createNote({
      title: "Initial Title",
      content: "Initial Content",
    });

    await expect(
      noteService.updateNote(created.id, { title: "" })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw NotFoundError when updating non-existent note", async () => {
    await expect(
      noteService.updateNote("non-existent-uuid", { title: "Title" })
    ).rejects.toThrow(NotFoundError);
  });

  it("should delete a note successfully", async () => {
    const created = await noteService.createNote({
      title: "Delete Me",
      content: "Soon to be gone",
    });

    const deleted = await noteService.deleteNote(created.id);
    expect(deleted.id).toBe(created.id);

    await expect(
      noteService.getNote(created.id)
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw NotFoundError when deleting non-existent note", async () => {
    await expect(
      noteService.deleteNote("non-existent-uuid")
    ).rejects.toThrow(NotFoundError);
  });

  it("should normalize and deduplicate tags during note creation and updates", async () => {
    const created = await noteService.createNote({
      title: "Normalization test",
      content: "Checks lowercase, whitespace, duplicates",
      tags: ["React", " react ", "REACT", "TypeScript", "typescript", "", " "],
    });

    expect(created.tags.sort()).toEqual(["react", "typescript"].sort());

    const updated = await noteService.updateNote(created.id, {
      tags: ["Next.js", "next.js", "   React  ", "react"],
    });

    expect(updated.tags.sort()).toEqual(["next.js", "react"].sort());
  });

  describe("Export and Import Notes", () => {
    it("should export notes as JSON format", async () => {
      await noteService.createNote({ title: "Note A", content: "Content A", tags: ["tagA"] });
      await noteService.createNote({ title: "Note B", content: "Content B" });

      const exported = await noteService.exportNotes("json");
      const parsed = JSON.parse(exported);

      expect(parsed).toHaveLength(2);
      const titles = parsed.map((n: any) => n.title);
      expect(titles).toContain("Note A");
      expect(titles).toContain("Note B");
    });

    it("should export notes as Markdown format", async () => {
      await noteService.createNote({ title: "Markdown Title", content: "Markdown Content", tags: ["tag1"] });

      const exported = await noteService.exportNotes("markdown");
      expect(exported).toContain("# Markdown Title");
      expect(exported).toContain("Markdown Content");
      expect(exported).toContain("Tags:\n- tag1");
      expect(exported).toContain("Created:");
      expect(exported).toContain("---");
    });

    it("should import notes validating structures, handling duplicates and skipping malformed tags", async () => {
      await noteService.createNote({ title: "Existing", content: "Same body", tags: ["tag1"] });

      const fileData = [
        { title: "New Note", content: "New Content", tags: ["new-tag", "  New-tag ", ""] },
        { title: "Existing", content: "Same body", tags: ["other"] },
        { title: "Bad Note", tags: ["some"] },
        { content: "No Title" },
      ];

      const result = await noteService.importNotes(JSON.stringify(fileData));

      expect(result.imported).toBe(1);
      expect(result.skipped).toBe(1);
      expect(result.failed).toBe(2);

      const notes = await noteService.getNotes();
      const list = notes as NoteDomain[];
      const importedNote = list.find((n) => n.title === "New Note");
      expect(importedNote).toBeDefined();
      expect(importedNote?.tags).toEqual(["new-tag"]);
    });

    it("should throw ValidationError for malformed JSON during import", async () => {
      await expect(
        noteService.importNotes("invalid-json{")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError if JSON content is not an array during import", async () => {
      await expect(
        noteService.importNotes(JSON.stringify({ note: "single" }))
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("Soft Delete and Permanent Delete", () => {
    it("should soft delete a note and filter it from active notes queries", async () => {
      const note = await noteService.createNote({ title: "To Delete", content: "Some content" });
      const active1 = await noteService.getNotes();
      expect(active1).toHaveLength(1);

      const deleted = await noteService.deleteNote(note.id);
      expect(deleted.deletedAt).toBeDefined();
      expect(deleted.deletedAt).not.toBeNull();

      const active2 = await noteService.getNotes();
      expect(active2).toHaveLength(0);

      // getNote details of soft deleted should throw NotFound
      await expect(noteService.getNote(note.id)).rejects.toThrow(NotFoundError);
    });

    it("should retrieve soft deleted notes via getTrashNotes", async () => {
      const noteA = await noteService.createNote({ title: "A", content: "A" });
      const noteB = await noteService.createNote({ title: "B", content: "B" });
      await noteService.deleteNote(noteA.id);

      const trash = await noteService.getTrashNotes();
      const trashList = trash as NoteDomain[];
      expect(trashList).toHaveLength(1);
      expect(trashList[0].title).toBe("A");
    });

    it("should restore a soft deleted note back to active notes", async () => {
      const note = await noteService.createNote({ title: "A", content: "A" });
      await noteService.deleteNote(note.id);

      const restored = await noteService.restoreNote(note.id);
      expect(restored.deletedAt).toBeNull();

      const active = await noteService.getNotes();
      expect(active).toHaveLength(1);
    });

    it("should throw ValidationError when trying to restore or permanently delete an active note", async () => {
      const note = await noteService.createNote({ title: "Active Note", content: "Content" });

      await expect(noteService.restoreNote(note.id)).rejects.toThrow(ValidationError);
      await expect(noteService.permanentDeleteNote(note.id)).rejects.toThrow(ValidationError);
    });

    it("should permanently delete a soft deleted note, removing relations", async () => {
      const note = await noteService.createNote({ title: "Trash Note", content: "Content", tags: ["tagx"] });
      await noteService.deleteNote(note.id);

      const permanent = await noteService.permanentDeleteNote(note.id);
      expect(permanent.id).toBe(note.id);

      const trash = await noteService.getTrashNotes();
      expect(trash).toHaveLength(0);

      // Verify not found on findById
      const found = await prisma.note.findUnique({ where: { id: note.id } });
      expect(found).toBeNull();
    });
  });
});
