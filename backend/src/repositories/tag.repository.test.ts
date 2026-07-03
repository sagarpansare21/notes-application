import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { tagRepository } from "./tag.repository";
import { noteRepository } from "./note.repository";
import { prisma } from "../config/prisma";

describe("TagRepository", () => {
  beforeEach(async () => {
    await prisma.note.deleteMany();
    await prisma.tag.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should retrieve all unique tags sorted alphabetically", async () => {
    await noteRepository.create({ title: "Note A", content: "Content", tags: ["zebra", "apple"] });
    await noteRepository.create({ title: "Note B", content: "Content", tags: ["apple", "banana"] });

    const tags = await tagRepository.findAll();
    expect(tags).toHaveLength(3);
    expect(tags[0].name).toBe("apple");
    expect(tags[1].name).toBe("banana");
    expect(tags[2].name).toBe("zebra");
  });
});
