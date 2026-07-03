import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { noteService } from "./note.service";
import { prisma } from "../config/prisma";
import { ValidationError, NotFoundError } from "../utils";

describe("NoteService", () => {
  beforeEach(async () => {
    // Clear notes before each test
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    // Close database connection
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
});
