import { prisma } from "../config";
import { Note, Tag } from "@prisma/client";
import { NoteDomain } from "../types";

export type NoteWithTags = Note & {
  tags: Tag[];
};

function mapToDomain(note: NoteWithTags): NoteDomain {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    tags: note.tags.map((t) => t.name),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

export class NoteRepository {
  async create(data: { title: string; content: string; tags?: string[] }): Promise<NoteDomain> {
    const note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        tags: data.tags ? {
          connectOrCreate: data.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        } : undefined,
      },
      include: { tags: true },
    });
    return mapToDomain(note);
  }

  async findById(id: string): Promise<NoteDomain | null> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: { tags: true },
    });
    return note ? mapToDomain(note) : null;
  }

  async findAll(params?: { search?: string; tag?: string }): Promise<NoteDomain[]> {
    const where: any = {};

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search } },
        { content: { contains: params.search } },
      ];
    }

    if (params?.tag) {
      where.tags = {
        some: {
          name: params.tag,
        },
      };
    }

    const notes = await prisma.note.findMany({
      where,
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    });

    return notes.map(mapToDomain);
  }

  async update(
    id: string,
    data: { title?: string; content?: string; tags?: string[] }
  ): Promise<NoteDomain> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.tags !== undefined) {
      updateData.tags = {
        set: [],
        connectOrCreate: data.tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      };
    }

    const note = await prisma.note.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    });
    return mapToDomain(note);
  }

  async delete(id: string): Promise<NoteDomain> {
    const note = await prisma.note.delete({
      where: { id },
      include: { tags: true },
    });
    return mapToDomain(note);
  }

  async search(
    query: string,
    options?: { limit?: number; offset?: number; sortBy?: string; sortOrder?: "asc" | "desc" }
  ): Promise<NoteDomain[]> {
    const where = {
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
      ],
    };
    const orderBy = options?.sortBy ? ({ [options.sortBy]: options.sortOrder || "desc" } as any) : undefined;
    const notes = await prisma.note.findMany({
      where,
      include: { tags: true },
      take: options?.limit,
      skip: options?.offset,
      orderBy,
    });
    return notes.map(mapToDomain);
  }

  async filterByTag(
    tag: string,
    options?: { limit?: number; offset?: number; sortBy?: string; sortOrder?: "asc" | "desc" }
  ): Promise<NoteDomain[]> {
    const where = {
      tags: {
        some: {
          name: tag,
        },
      },
    };
    const orderBy = options?.sortBy ? ({ [options.sortBy]: options.sortOrder || "desc" } as any) : undefined;
    const notes = await prisma.note.findMany({
      where,
      include: { tags: true },
      take: options?.limit,
      skip: options?.offset,
      orderBy,
    });
    return notes.map(mapToDomain);
  }

  async pagination(options: {
    limit: number;
    offset: number;
    search?: string;
    tag?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{ data: NoteDomain[]; total: number; limit: number; offset: number }> {
    const where: any = {};
    if (options.search) {
      where.OR = [
        { title: { contains: options.search } },
        { content: { contains: options.search } },
      ];
    }
    if (options.tag) {
      where.tags = {
        some: {
          name: options.tag,
        },
      };
    }
    const orderBy = options.sortBy ? ({ [options.sortBy]: options.sortOrder || "desc" } as any) : { createdAt: "desc" as const };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: { tags: true },
        take: options.limit,
        skip: options.offset,
        orderBy,
      }),
      prisma.note.count({ where }),
    ]);

    return {
      data: notes.map(mapToDomain),
      total,
      limit: options.limit,
      offset: options.offset,
    };
  }

  async sorting(options: {
    sortBy: string;
    sortOrder: "asc" | "desc";
    search?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }): Promise<NoteDomain[]> {
    const where: any = {};
    if (options.search) {
      where.OR = [
        { title: { contains: options.search } },
        { content: { contains: options.search } },
      ];
    }
    if (options.tag) {
      where.tags = {
        some: {
          name: options.tag,
        },
      };
    }
    const orderBy = { [options.sortBy]: options.sortOrder } as any;

    const notes = await prisma.note.findMany({
      where,
      include: { tags: true },
      orderBy,
      take: options.limit,
      skip: options.offset,
    });

    return notes.map(mapToDomain);
  }

  async importNote(data: { title: string; content: string; tags: string[] }): Promise<'imported' | 'skipped'> {
    return await prisma.$transaction(async (tx) => {
      const exists = await tx.note.findFirst({
        where: { title: data.title, content: data.content },
      });
      if (exists) {
        return "skipped";
      }
      await tx.note.create({
        data: {
          title: data.title,
          content: data.content,
          tags: {
            connectOrCreate: data.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      });
      return "imported";
    });
  }
}
export const noteRepository = new NoteRepository();
