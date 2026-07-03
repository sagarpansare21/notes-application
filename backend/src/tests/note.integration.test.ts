import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { buildApp } from "../app";
import { prisma } from "../config/prisma";

describe("API Integration Tests (Fastify inject)", () => {
  const app = buildApp();

  beforeEach(async () => {
    // Clear notes and tags before each test run
    await prisma.note.deleteMany();
    await prisma.tag.deleteMany();
  });

  afterAll(async () => {
    // Disconnect Prisma and close Fastify app
    await prisma.$disconnect();
    await app.close();
  });

  it("POST /api/v1/notes - should create a note", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: {
        title: "Integration Test Note",
        content: "Testing via fastify inject",
        tags: ["integration", "test"],
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Note created successfully");
    expect(body.data.title).toBe("Integration Test Note");
    expect(body.data.tags.sort()).toEqual(["integration", "test"].sort());
  });

  it("POST /api/v1/notes - should throw validation error if title is missing", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: {
        title: "",
        content: "No title content",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
  });

  it("GET /api/v1/notes - should retrieve all notes", async () => {
    // Create seed data using inject
    await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "Note 1", content: "Content 1" },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/notes",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe("Note 1");
  });

  it("GET /api/v1/notes/:id - should retrieve a specific note by ID", async () => {
    const createRes = await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "Specific Note", content: "Specific Content" },
    });
    const createdNote = JSON.parse(createRes.body).data;

    const response = await app.inject({
      method: "GET",
      url: `/api/v1/notes/${createdNote.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(createdNote.id);
  });

  it("GET /api/v1/notes/:id - should return 404 for non-existent note", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/notes/00000000-0000-0000-0000-000000000000",
    });

    expect(response.statusCode).toBe(404);
  });

  it("PATCH /api/v1/notes/:id - should update note fields", async () => {
    const createRes = await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "Original Title", content: "Original Content" },
    });
    const createdNote = JSON.parse(createRes.body).data;

    const response = await app.inject({
      method: "PATCH",
      url: `/api/v1/notes/${createdNote.id}`,
      payload: {
        title: "Patched Title",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.title).toBe("Patched Title");
  });

  it("DELETE /api/v1/notes/:id - should delete note", async () => {
    const createRes = await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "To Be Deleted", content: "Temporary" },
    });
    const createdNote = JSON.parse(createRes.body).data;

    const response = await app.inject({
      method: "DELETE",
      url: `/api/v1/notes/${createdNote.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(createdNote.id);

    // Verify it is deleted
    const getRes = await app.inject({
      method: "GET",
      url: `/api/v1/notes/${createdNote.id}`,
    });
    expect(getRes.statusCode).toBe(404);
  });

  it("GET /api/v1/tags - should retrieve all unique tags sorted alphabetically", async () => {
    // Create notes with various tags (including duplicates)
    await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "Note A", content: "Content", tags: ["zebra", "apple"] },
    });
    await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "Note B", content: "Content", tags: ["apple", "banana"] },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/tags",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(3);
    expect(body.data[0].name).toBe("apple");
    expect(body.data[1].name).toBe("banana");
    expect(body.data[2].name).toBe("zebra");
    expect(body.data[0].id).toBeDefined();
  });
});
