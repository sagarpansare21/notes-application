import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { tagService } from "./tag.service";
import { noteRepository } from "../repositories/note.repository";
import { prisma } from "../config/prisma";

describe("TagService", () => {
  beforeEach(async () => {
    await prisma.note.deleteMany();
    await prisma.tag.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should retrieve tags from repository via service", async () => {
    await noteRepository.create({ title: "Note A", content: "Content", tags: ["zebra", "apple"] });

    const tags = await tagService.getTags();
    expect(tags).toHaveLength(2);
    expect(tags[0].name).toBe("apple");
    expect(tags[1].name).toBe("zebra");
  });
});
