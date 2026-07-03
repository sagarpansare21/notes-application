import { FastifyPluginAsync } from "fastify";
import { noteController, tagController } from "../controllers";

export const noteRoutes: FastifyPluginAsync = async (fastify) => {
  // Create a note
  fastify.post("/notes", {
    schema: {
      description: "Create a new note",
      tags: ["Notes"],
      body: { $ref: "createNote#" },
      response: {
        201: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { $ref: "noteResponse#" },
          },
        },
      },
    },
    handler: noteController.createNote,
  });

  // Get notes
  fastify.get("/notes", {
    schema: {
      description: "Get all notes (supports optional filters, sorting, and pagination)",
      tags: ["Notes"],
      querystring: { $ref: "getNotesQuery#" },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
              oneOf: [
                {
                  type: "array",
                  items: { $ref: "noteResponse#" },
                },
                {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "noteResponse#" },
                    },
                    total: { type: "integer" },
                    limit: { type: "integer" },
                    offset: { type: "integer" },
                  },
                  required: ["data", "total", "limit", "offset"],
                },
              ],
            },
          },
        },
      },
    },
    handler: noteController.getNotes,
  });

  // Get note by ID
  fastify.get("/notes/:id", {
    schema: {
      description: "Get a note by ID",
      tags: ["Notes"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { $ref: "noteResponse#" },
          },
        },
      },
    },
    handler: noteController.getNote,
  });

  // Update note by ID
  fastify.patch("/notes/:id", {
    schema: {
      description: "Update a note by ID",
      tags: ["Notes"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      body: { $ref: "updateNote#" },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { $ref: "noteResponse#" },
          },
        },
      },
    },
    handler: noteController.updateNote,
  });

  // Delete note by ID
  fastify.delete("/notes/:id", {
    schema: {
      description: "Delete a note by ID",
      tags: ["Notes"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { $ref: "noteResponse#" },
          },
        },
      },
    },
    handler: noteController.deleteNote,
  });

  // Get all tags
  fastify.get("/tags", {
    schema: {
      description: "Get all unique tags sorted alphabetically",
      tags: ["Tags"],
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { $ref: "tagsResponse#" },
          },
        },
      },
    },
    handler: tagController.getTags,
  });
};
