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
      expect(parsed[0].title).toBe("Note B");
      expect(parsed[1].title).toBe("Note A");
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
});
