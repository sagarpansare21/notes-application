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

  it("GET /api/v1/notes/export?format=json - should export notes as JSON attachment", async () => {
    await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "Export Json", content: "Json Content" },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/notes/export?format=json",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-disposition"]).toContain('attachment; filename="notes.json"');
    expect(response.headers["content-type"]).toContain("application/json");

    const parsed = JSON.parse(response.payload);
    expect(parsed).toBeInstanceOf(Array);
    expect(parsed.some((n: any) => n.title === "Export Json")).toBe(true);
  });

  it("GET /api/v1/notes/export?format=markdown - should export notes as Markdown attachment", async () => {
    await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "Export Markdown", content: "Markdown Content" },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/notes/export?format=markdown",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-disposition"]).toContain('attachment; filename="notes.md"');
    expect(response.headers["content-type"]).toContain("text/markdown");
    expect(response.payload).toContain("# Export Markdown");
  });

  it("POST /api/v1/notes/import - should import notes successfully from JSON multipart payload", async () => {
    const payloadNotes = [
      { title: "Import Note 1", content: "Import Content 1", tags: ["a", "b"] },
      { title: "Import Note 2", content: "Import Content 2" }
    ];

    const boundary = "------WebKitFormBoundary7MA4YWxkTrZu0gW";
    const payload = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="notes.json"',
      "Content-Type: application/json",
      "",
      JSON.stringify(payloadNotes),
      `--${boundary}--`
    ].join("\r\n");

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/notes/import",
      headers: {
        "content-type": `multipart/form-data; boundary=${boundary}`
      },
      payload
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data.imported).toBe(2);
    expect(body.data.skipped).toBe(0);
    expect(body.data.failed).toBe(0);
  });

  it("POST /api/v1/notes/import - should skip duplicate notes", async () => {
    await app.inject({
      method: "POST",
      url: "/api/v1/notes",
      payload: { title: "Duplicate Note", content: "Existing Content" },
    });

    const payloadNotes = [
      { title: "Duplicate Note", content: "Existing Content" },
      { title: "Unique Note", content: "New Content" }
    ];

    const boundary = "------WebKitFormBoundary7MA4YWxkTrZu0gW";
    const payload = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="notes.json"',
      "Content-Type: application/json",
      "",
      JSON.stringify(payloadNotes),
      `--${boundary}--`
    ].join("\r\n");

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/notes/import",
      headers: {
        "content-type": `multipart/form-data; boundary=${boundary}`
      },
      payload
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.data.imported).toBe(1);
    expect(body.data.skipped).toBe(1);
    expect(body.data.failed).toBe(0);
  });

  it("POST /api/v1/notes/import - should return 400 validation error for invalid file extension", async () => {
    const boundary = "------WebKitFormBoundary7MA4YWxkTrZu0gW";
    const payload = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="notes.txt"',
      "Content-Type: text/plain",
      "",
      "some plain text content",
      `--${boundary}--`
    ].join("\r\n");

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/notes/import",
      headers: {
        "content-type": `multipart/form-data; boundary=${boundary}`
      },
      payload
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.message).toContain("Only JSON files are supported");
  });

  it("POST /api/v1/notes/import - should return 400 for malformed JSON structure", async () => {
    const boundary = "------WebKitFormBoundary7MA4YWxkTrZu0gW";
    const payload = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="notes.json"',
      "Content-Type: application/json",
      "",
      "invalid-json{[",
      `--${boundary}--`
    ].join("\r\n");

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/notes/import",
      headers: {
        "content-type": `multipart/form-data; boundary=${boundary}`
      },
      payload
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
    expect(body.message).toContain("Malformed JSON file");
  });
});
