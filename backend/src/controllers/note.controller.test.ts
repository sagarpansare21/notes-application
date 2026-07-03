import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { noteController } from "./note.controller";
import { noteService } from "../services/note.service";
import { prisma } from "../config/prisma";
import { ValidationError, NotFoundError } from "../utils";

function createMockReply() {
  const reply: any = {
    statusCode: 200,
    payload: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    send(data: any) {
      this.payload = data;
      return this;
    },
  };
  return reply;
}

describe("NoteController", () => {
  beforeEach(async () => {
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should handle createNote successfully", async () => {
    const request = {
      body: {
        title: "Controller Note",
        content: "Tested from controller",
        tags: ["controller"],
      },
    };
    const reply = createMockReply();

    await noteController.createNote(request, reply);

    expect(reply.statusCode).toBe(201);
    expect(reply.payload.success).toBe(true);
    expect(reply.payload.message).toBe("Note created successfully");
    expect(reply.payload.data.title).toBe("Controller Note");
  });

  it("should propagate service ValidationError in createNote", async () => {
    const request = {
      body: {
        title: "",
        content: "Some content",
      },
    };
    const reply = createMockReply();

    await expect(noteController.createNote(request, reply)).rejects.toThrow(ValidationError);
  });

  it("should handle getNotes successfully", async () => {
    await noteService.createNote({ title: "Seed 1", content: "Content 1" });

    const request = {
      query: {},
    };
    const reply = createMockReply();

    await noteController.getNotes(request, reply);

    expect(reply.statusCode).toBe(200);
    expect(reply.payload.success).toBe(true);
    expect(reply.payload.data).toHaveLength(1);
  });

  it("should parse limits and offsets in getNotes", async () => {
    await noteService.createNote({ title: "Seed 1", content: "Content 1" });
    await noteService.createNote({ title: "Seed 2", content: "Content 2" });

    const request = {
      query: {
        limit: "1",
        offset: "1",
      },
    };
    const reply = createMockReply();

    await noteController.getNotes(request, reply);

    expect(reply.statusCode).toBe(200);
    expect(reply.payload.success).toBe(true);
    expect(reply.payload.data.data).toHaveLength(1);
    expect(reply.payload.data.total).toBe(2);
  });

  it("should handle getNote successfully", async () => {
    const note = await noteService.createNote({ title: "Seed 1", content: "Content 1" });

    const request = {
      params: { id: note.id },
    };
    const reply = createMockReply();

    await noteController.getNote(request, reply);

    expect(reply.statusCode).toBe(200);
    expect(reply.payload.success).toBe(true);
    expect(reply.payload.data.id).toBe(note.id);
  });

  it("should propagate service NotFoundError in getNote", async () => {
    const request = {
      params: { id: "non-existent-uuid" },
    };
    const reply = createMockReply();

    await expect(noteController.getNote(request, reply)).rejects.toThrow(NotFoundError);
  });

  it("should handle updateNote successfully", async () => {
    const note = await noteService.createNote({ title: "Seed 1", content: "Content 1" });

    const request = {
      params: { id: note.id },
      body: { title: "Updated Title" },
    };
    const reply = createMockReply();

    await noteController.updateNote(request, reply);

    expect(reply.statusCode).toBe(200);
    expect(reply.payload.success).toBe(true);
    expect(reply.payload.data.title).toBe("Updated Title");
  });

  it("should handle deleteNote successfully", async () => {
    const note = await noteService.createNote({ title: "Seed 1", content: "Content 1" });

    const request = {
      params: { id: note.id },
    };
    const reply = createMockReply();

    await noteController.deleteNote(request, reply);

    expect(reply.statusCode).toBe(200);
    expect(reply.payload.success).toBe(true);
    expect(reply.payload.data.id).toBe(note.id);

    await expect(noteService.getNote(note.id)).rejects.toThrow(NotFoundError);
  });
});
