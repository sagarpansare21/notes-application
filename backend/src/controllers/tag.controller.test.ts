import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { tagController } from "./tag.controller";
import { noteService } from "../services/note.service";
import { prisma } from "../config/prisma";

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

describe("TagController", () => {
  beforeEach(async () => {
    await prisma.note.deleteMany();
    await prisma.tag.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should handle getTags successfully", async () => {
    await noteService.createNote({ title: "Seed 1", content: "Content 1", tags: ["apple"] });

    const request = {};
    const reply = createMockReply();

    await tagController.getTags(request, reply);

    expect(reply.statusCode).toBe(200);
    expect(reply.payload.success).toBe(true);
    expect(reply.payload.data).toHaveLength(1);
    expect(reply.payload.data[0].name).toBe("apple");
  });
});
