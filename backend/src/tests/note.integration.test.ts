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

  describe("Soft Delete and Permanent Delete Endpoints", () => {
    it("should soft delete note, then verify it is not returned in normal GET but shows in GET /trash", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/notes",
        payload: { title: "Note to trash", content: "Test Content" }
      });
      const note = JSON.parse(createRes.payload).data;

      // Soft delete
      const delRes = await app.inject({
        method: "DELETE",
        url: `/api/v1/notes/${note.id}`
      });
      expect(delRes.statusCode).toBe(200);

      // Verify normal query excludes it
      const activeRes = await app.inject({
        method: "GET",
        url: "/api/v1/notes"
      });
      const activeNotes = JSON.parse(activeRes.payload).data;
      expect(activeNotes.some((n: any) => n.id === note.id)).toBe(false);

      // Verify getNote on soft deleted note returns 404
      const singleRes = await app.inject({
        method: "GET",
        url: `/api/v1/notes/${note.id}`
      });
      expect(singleRes.statusCode).toBe(404);

      // Verify trash query includes it
      const trashRes = await app.inject({
        method: "GET",
        url: "/api/v1/trash"
      });
      const trashNotes = JSON.parse(trashRes.payload).data;
      expect(trashNotes.some((n: any) => n.id === note.id)).toBe(true);
    });

    it("should restore a soft deleted note", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/notes",
        payload: { title: "To Restore", content: "Test Content" }
      });
      const note = JSON.parse(createRes.payload).data;

      // Soft delete
      await app.inject({
        method: "DELETE",
        url: `/api/v1/notes/${note.id}`
      });

      // Restore
      const restoreRes = await app.inject({
        method: "POST",
        url: `/api/v1/notes/${note.id}/restore`
      });
      expect(restoreRes.statusCode).toBe(200);
      expect(JSON.parse(restoreRes.payload).data.deletedAt).toBeNull();

      // Verify it is back in active list
      const activeRes = await app.inject({
        method: "GET",
        url: "/api/v1/notes"
      });
      const activeNotes = JSON.parse(activeRes.payload).data;
      expect(activeNotes.some((n: any) => n.id === note.id)).toBe(true);
    });

    it("should permanently delete a soft deleted note and handle validation constraints", async () => {
      const createRes = await app.inject({
        method: "POST",
        url: "/api/v1/notes",
        payload: { title: "Permanent", content: "Test Content" }
      });
      const note = JSON.parse(createRes.payload).data;

      // 400 when trying to permanently delete active note (not in trash)
      const errRes = await app.inject({
        method: "DELETE",
        url: `/api/v1/trash/${note.id}`
      });
      expect(errRes.statusCode).toBe(400);

      // Soft delete
      await app.inject({
        method: "DELETE",
        url: `/api/v1/notes/${note.id}`
      });

      // Permanent delete
      const permRes = await app.inject({
        method: "DELETE",
        url: `/api/v1/trash/${note.id}`
      });
      expect(permRes.statusCode).toBe(200);

      // Verify 404 on subsequent get/permanent delete
      const missingRes = await app.inject({
        method: "DELETE",
        url: `/api/v1/trash/${note.id}`
      });
      expect(missingRes.statusCode).toBe(404);
    });

    it("DELETE /api/v1/trash - should permanently delete all soft-deleted notes", async () => {
      // 1. Create a note and soft delete it
      const createRes1 = await app.inject({
        method: "POST",
        url: "/api/v1/notes",
        payload: { title: "Trash A", content: "To be cleared" }
      });
      const note1 = JSON.parse(createRes1.payload).data;
      await app.inject({
        method: "DELETE",
        url: `/api/v1/notes/${note1.id}`
      });

      // 2. Create another note and soft delete it
      const createRes2 = await app.inject({
        method: "POST",
        url: "/api/v1/notes",
        payload: { title: "Trash B", content: "To be cleared too" }
      });
      const note2 = JSON.parse(createRes2.payload).data;
      await app.inject({
        method: "DELETE",
        url: `/api/v1/notes/${note2.id}`
      });

      // 3. Clear trash
      const clearRes = await app.inject({
        method: "DELETE",
        url: "/api/v1/trash"
      });
      expect(clearRes.statusCode).toBe(200);
      const clearBody = JSON.parse(clearRes.payload);
      expect(clearBody.success).toBe(true);
      expect(clearBody.data.count).toBeGreaterThanOrEqual(2);

      // 4. Verify trash is empty
      const getTrashRes = await app.inject({
        method: "GET",
        url: "/api/v1/trash"
      });
      const trashNotes = JSON.parse(getTrashRes.payload).data;
      expect(trashNotes).toHaveLength(0);
    });
  });
});
