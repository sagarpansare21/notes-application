import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { noteRepository } from "./note.repository";
import { prisma } from "../config/prisma";

describe("NoteRepository", () => {
  beforeEach(async () => {
    // Clear notes before each test
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    // Close database connection
    await prisma.$disconnect();
  });

  it("should create a note and retrieve it by ID", async () => {
    const created = await noteRepository.create({
      title: "Test Note",
      content: "This is test content",
      tags: ["tag1", "tag2"],
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe("Test Note");
    expect(created.content).toBe("This is test content");
    expect(created.tags).toEqual(["tag1", "tag2"]);

    const found = await noteRepository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.title).toBe("Test Note");
  });

  it("should return null for non-existent note ID", async () => {
    const found = await noteRepository.findById("non-existent-id");
    expect(found).toBeNull();
  });

  it("should update a note's properties", async () => {
    const created = await noteRepository.create({
      title: "Original Title",
      content: "Original Content",
      tags: ["tag1"],
    });

    const updated = await noteRepository.update(created.id, {
      title: "New Title",
      tags: ["tag1", "tag2"],
    });

    expect(updated.id).toBe(created.id);
    expect(updated.title).toBe("New Title");
    expect(updated.content).toBe("Original Content");
    expect(updated.tags).toEqual(["tag1", "tag2"]);
  });

  it("should delete a note and return the deleted note", async () => {
    const created = await noteRepository.create({
      title: "To Be Deleted",
      content: "Short lived content",
    });

    const deleted = await noteRepository.delete(created.id);
    expect(deleted.id).toBe(created.id);

    const found = await noteRepository.findById(created.id);
    expect(found).toBeNull();
  });

  it("should search notes by title or content", async () => {
    await noteRepository.create({ title: "Apple Pie Recipe", content: "Bake at 350 degrees" });
    await noteRepository.create({ title: "Bake Bread", content: "Need flour, water, yeast" });
    await noteRepository.create({ title: "Grocery list", content: "Buy apples and milk" });

    // Search for 'Apple' or 'apples'
    const results = await noteRepository.search("apple");
    expect(results).toHaveLength(2);
    expect(results.map(r => r.title)).toContain("Apple Pie Recipe");
    expect(results.map(r => r.title)).toContain("Grocery list");

    // Search for 'Bake'
    const results2 = await noteRepository.search("Bake");
    expect(results2).toHaveLength(2);
    expect(results2.map(r => r.title)).toContain("Apple Pie Recipe");
    expect(results2.map(r => r.title)).toContain("Bake Bread");
  });

  it("should filter notes by tag", async () => {
    await noteRepository.create({ title: "Note 1", content: "Content 1", tags: ["work", "important"] });
    await noteRepository.create({ title: "Note 2", content: "Content 2", tags: ["personal"] });
    await noteRepository.create({ title: "Note 3", content: "Content 3", tags: ["work"] });

    const workNotes = await noteRepository.filterByTag("work");
    expect(workNotes).toHaveLength(2);
    expect(workNotes.map(n => n.title)).toContain("Note 1");
    expect(workNotes.map(n => n.title)).toContain("Note 3");

    const personalNotes = await noteRepository.filterByTag("personal");
    expect(personalNotes).toHaveLength(1);
    expect(personalNotes[0].title).toBe("Note 2");
  });

  it("should paginate notes correctly", async () => {
    // Seed 5 notes
    for (let i = 1; i <= 5; i++) {
      await noteRepository.create({
        title: `Note ${i}`,
        content: `Content ${i}`,
      });
    }

    const page1 = await noteRepository.pagination({ limit: 2, offset: 0 });
    expect(page1.data).toHaveLength(2);
    expect(page1.total).toBe(5);

    const page2 = await noteRepository.pagination({ limit: 2, offset: 2 });
    expect(page2.data).toHaveLength(2);
    expect(page2.total).toBe(5);

    const page3 = await noteRepository.pagination({ limit: 2, offset: 4 });
    expect(page3.data).toHaveLength(1);
  });

  it("should sort notes by field name and order", async () => {
    await noteRepository.create({ title: "Z Note", content: "Z Content" });
    await noteRepository.create({ title: "A Note", content: "A Content" });
    await noteRepository.create({ title: "M Note", content: "M Content" });

    const sortedAsc = await noteRepository.sorting({ sortBy: "title", sortOrder: "asc" });
    expect(sortedAsc[0].title).toBe("A Note");
    expect(sortedAsc[1].title).toBe("M Note");
    expect(sortedAsc[2].title).toBe("Z Note");

    const sortedDesc = await noteRepository.sorting({ sortBy: "title", sortOrder: "desc" });
    expect(sortedDesc[0].title).toBe("Z Note");
    expect(sortedDesc[1].title).toBe("M Note");
    expect(sortedDesc[2].title).toBe("A Note");
  });
});
