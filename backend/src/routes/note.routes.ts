import { FastifyPluginAsync } from "fastify";
import { noteController, tagController } from "../controllers";

export const noteRoutes: FastifyPluginAsync = async (fastify) => {
  // Create a note
  fastify.post("/notes", {
    schema: {
      summary: "Create a new note",
      description: "Creates a new note record. Any provided tags are automatically trimmed, normalized to lowercase, and deduplicated.",
      tags: ["Notes"],
      body: { $ref: "createNote#" },
      response: {
        201: {
          description: "Note created successfully",
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Note created successfully" },
            data: { $ref: "noteResponse#" },
          },
          required: ["success", "message", "data"],
        },
        400: {
          description: "Invalid request payload or validation constraint violation",
          $ref: "apiValidationErrorResponse#",
        },
        500: {
          description: "Internal server error occurred",
          $ref: "apiErrorResponse#",
        },
      },
    },
    handler: noteController.createNote,
  });

  // Get notes
  fastify.get("/notes", {
    schema: {
      summary: "Get notes list",
      description: "Retrieves a list of notes. Supports optional search keywords, tag filtering, pagination (limit and offset), and dynamic sorting.",
      tags: ["Notes"],
      querystring: { $ref: "getNotesQuery#" },
      response: {
        200: {
          description: "List of notes retrieved successfully",
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Notes retrieved successfully" },
            data: {
              oneOf: [
                {
                  type: "array",
                  items: { $ref: "noteResponse#" },
                  description: "Simple list of notes when pagination is not used",
                },
                {
                  type: "object",
                  description: "Paginated response object when limit and offset query params are provided",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "noteResponse#" },
                    },
                    total: { type: "integer", description: "Total count of matching notes in the database", example: 1 },
                    limit: { type: "integer", description: "Page size limit used", example: 10 },
                    offset: { type: "integer", description: "Offset index used", example: 0 },
                  },
                  required: ["data", "total", "limit", "offset"],
                },
              ],
            },
          },
          required: ["success", "message", "data"],
        },
        500: {
          description: "Internal server error occurred",
          $ref: "apiErrorResponse#",
        },
      },
    },
    handler: noteController.getNotes,
  });

  // Get note by ID
  fastify.get("/notes/:id", {
    schema: {
      summary: "Get a specific note by ID",
      description: "Retrieves details of a single note using its unique identifier.",
      tags: ["Notes"],
      params: {
        type: "object",
        description: "Path parameters",
        properties: {
          id: { 
            type: "string", 
            description: "Unique note identifier",
            example: "cb05a418-ed17-4a17-96dc-f777084fe4eb"
          },
        },
        required: ["id"],
      },
      response: {
        200: {
          description: "Note details retrieved successfully",
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Note retrieved successfully" },
            data: { $ref: "noteResponse#" },
          },
          required: ["success", "message", "data"],
        },
        404: {
          description: "Requested note was not found",
          $ref: "apiErrorResponse#",
        },
        500: {
          description: "Internal server error occurred",
          $ref: "apiErrorResponse#",
        },
      },
    },
    handler: noteController.getNote,
  });

  // Update note by ID
  fastify.patch("/notes/:id", {
    schema: {
      summary: "Update an existing note by ID",
      description: "Modifies fields of an existing note. If tags are provided, they are normalized and replace the previous tag associations completely.",
      tags: ["Notes"],
      params: {
        type: "object",
        description: "Path parameters",
        properties: {
          id: { 
            type: "string", 
            description: "Unique note identifier to modify",
            example: "cb05a418-ed17-4a17-96dc-f777084fe4eb"
          },
        },
        required: ["id"],
      },
      body: { $ref: "updateNote#" },
      response: {
        200: {
          description: "Note updated successfully",
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Note updated successfully" },
            data: { $ref: "noteResponse#" },
          },
          required: ["success", "message", "data"],
        },
        400: {
          description: "Invalid request fields or validation constraint failure",
          $ref: "apiValidationErrorResponse#",
        },
        404: {
          description: "Requested note was not found",
          $ref: "apiErrorResponse#",
        },
        500: {
          description: "Internal server error occurred",
          $ref: "apiErrorResponse#",
        },
      },
    },
    handler: noteController.updateNote,
  });

  // Delete note by ID
  fastify.delete("/notes/:id", {
    schema: {
      summary: "Delete a note by ID",
      description: "Removes a note record and all associated tag relationships from the database.",
      tags: ["Notes"],
      params: {
        type: "object",
        description: "Path parameters",
        properties: {
          id: { 
            type: "string", 
            description: "Unique note identifier to delete",
            example: "cb05a418-ed17-4a17-96dc-f777084fe4eb"
          },
        },
        required: ["id"],
      },
      response: {
        200: {
          description: "Note deleted successfully",
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Note deleted successfully" },
            data: { $ref: "noteResponse#" },
          },
          required: ["success", "message", "data"],
        },
        404: {
          description: "Requested note was not found",
          $ref: "apiErrorResponse#",
        },
        500: {
          description: "Internal server error occurred",
          $ref: "apiErrorResponse#",
        },
      },
    },
    handler: noteController.deleteNote,
  });

  // Get all tags
  fastify.get("/tags", {
    schema: {
      summary: "Get tags list",
      description: "Retrieves all unique tags from the database sorted alphabetically.",
      tags: ["Tags"],
      response: {
        200: {
          description: "Tags retrieved successfully",
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Tags retrieved successfully" },
            data: { $ref: "tagsResponse#" },
          },
          required: ["success", "message", "data"],
        },
        500: {
          description: "Internal server error occurred",
          $ref: "apiErrorResponse#",
        },
      },
    },
    handler: tagController.getTags,
  });
};
