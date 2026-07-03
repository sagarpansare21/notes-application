import { prisma } from "../config";
import { TagDomain } from "../types";

export class TagRepository {
  async findAll(): Promise<TagDomain[]> {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });
    return tags;
  }
}

export const tagRepository = new TagRepository();
