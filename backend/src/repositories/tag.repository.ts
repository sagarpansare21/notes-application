import { prisma } from "../config";
import { TagDomain } from "../types";

export class TagRepository {
  async findAll(): Promise<TagDomain[]> {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            notes: {
              where: {
                deletedAt: null
              }
            }
          }
        }
      }
    });
    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      noteCount: tag._count.notes
    }));
  }
}

export const tagRepository = new TagRepository();
