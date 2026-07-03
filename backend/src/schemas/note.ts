export const noteResponseSchema = {
  $id: "noteResponse",
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    title: { type: "string" },
    content: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["id", "title", "content", "tags", "createdAt", "updatedAt"],
} as const;

export const createNoteSchema = {
  $id: "createNote",
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255 },
    content: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
  },
  required: ["title", "content"],
} as const;

export const updateNoteSchema = {
  $id: "updateNote",
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255 },
    content: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
  },
} as const;

export const getNotesQuerySchema = {
  $id: "getNotesQuery",
  type: "object",
  properties: {
    search: { type: "string" },
    tag: { type: "string" },
  },
} as const;
