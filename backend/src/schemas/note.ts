export const noteResponseSchema = {
  $id: "noteResponse",
  type: "object",
  description: "Represents a single Note record",
  properties: {
    id: { 
      type: "string", 
      format: "uuid", 
      description: "Unique note identifier",
      example: "cb05a418-ed17-4a17-96dc-f777084fe4eb"
    },
    title: { 
      type: "string", 
      description: "Title of the note",
      example: "Weekly Grocery Shopping List"
    },
    content: { 
      type: "string", 
      description: "Text content of the note",
      example: "Remember to buy milk, eggs, bread, and apples."
    },
    tags: { 
      type: "array", 
      items: { type: "string" }, 
      description: "Normalized note tag list",
      example: ["shopping", "weekly"]
    },
    createdAt: { 
      type: "string", 
      format: "date-time", 
      description: "Note creation date timestamp",
      example: "2026-07-04T01:30:00.000Z"
    },
    updatedAt: { 
      type: "string", 
      format: "date-time", 
      description: "Note last modification timestamp",
      example: "2026-07-04T01:35:00.000Z"
    },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
      description: "Timestamp when the note was soft deleted, or null if active",
      example: null
    },
  },
  required: ["id", "title", "content", "tags", "createdAt", "updatedAt", "deletedAt"],
} as const;

export const createNoteSchema = {
  $id: "createNote",
  type: "object",
  description: "Required request body schema for note creation",
  properties: {
    title: { 
      type: "string", 
      minLength: 1, 
      maxLength: 255, 
      description: "Title of the note",
      example: "Weekly Grocery Shopping List"
    },
    content: { 
      type: "string", 
      description: "Content of the note",
      example: "Remember to buy milk, eggs, bread, and apples."
    },
    tags: { 
      type: "array", 
      items: { type: "string" }, 
      description: "Optional list of tags for the note",
      example: ["shopping", "weekly"]
    },
  },
  required: ["title", "content"],
} as const;

export const updateNoteSchema = {
  $id: "updateNote",
  type: "object",
  description: "Optional request body schema for updating notes",
  properties: {
    title: { 
      type: "string", 
      minLength: 1, 
      maxLength: 255, 
      description: "New title of the note",
      example: "Project Brainstorming Ideas"
    },
    content: { 
      type: "string", 
      description: "New content of the note",
      example: "Brainstorming new features for our user dashboard design and layout."
    },
    tags: { 
      type: "array", 
      items: { type: "string" }, 
      description: "New tag list replacing previous tags",
      example: ["ideas", "work"]
    },
  },
} as const;

export const getNotesQuerySchema = {
  $id: "getNotesQuery",
  type: "object",
  description: "Query string parameters for sorting, filtering, and paginating notes",
  properties: {
    search: { 
      type: "string", 
      description: "Keyword to search in note titles or content",
      example: "shopping"
    },
    tag: { 
      type: "string", 
      description: "Tag name filter constraint",
      example: "ideas"
    },
    limit: {
      type: "integer",
      description: "Page size limit for query results",
      example: 10
    },
    offset: {
      type: "integer",
      description: "Skip offset index for query pagination",
      example: 0
    },
    sortBy: {
      type: "string",
      description: "Data property name to sort by",
      example: "createdAt"
    },
    sortOrder: {
      type: "string",
      enum: ["asc", "desc"],
      description: "Sorting direction order",
      example: "desc"
    }
  },
} as const;

export const tagsResponseSchema = {
  $id: "tagsResponse",
  type: "array",
  description: "List of unique tags retrieved from database",
  items: {
    type: "object",
    properties: {
      id: { 
        type: "string", 
        format: "uuid", 
        description: "Unique tag UUID reference ID",
        example: "952e329e-70b2-4d08-96c0-c1b5d769015e"
      },
      name: { 
        type: "string", 
        description: "Normalized lowercased tag name",
        example: "shopping"
      },
      noteCount: {
        type: "integer",
        description: "Number of active notes with this tag",
        example: 3
      },
    },
    required: ["id", "name"],
  },
} as const;

export const apiErrorResponseSchema = {
  $id: "apiErrorResponse",
  type: "object",
  description: "Standard HTTP error response payload format",
  properties: {
    success: { 
      type: "boolean", 
      description: "Indicates operation failure status",
      example: false 
    },
    message: { 
      type: "string", 
      description: "Human-readable error description message",
      example: "Note not found" 
    },
  },
  required: ["success", "message"],
} as const;

export const apiValidationErrorResponseSchema = {
  $id: "apiValidationErrorResponse",
  type: "object",
  description: "Request parameters or body input validation error details",
  properties: {
    success: { 
      type: "boolean", 
      description: "Indicates validation success state",
      example: false 
    },
    message: { 
      type: "string", 
      description: "Global error message context summary",
      example: "Validation failed." 
    },
    errors: {
      type: "array",
      description: "Detailed breakdowns of invalid input parameters",
      items: {
        type: "object",
        properties: {
          field: { 
            type: "string", 
            description: "Property path field name key that triggered the violation",
            example: "title" 
          },
          message: { 
            type: "string", 
            description: "Description of the validation constraint rule violation",
            example: "must NOT have fewer than 1 characters" 
          },
          code: { 
            type: "string", 
            description: "Constraint keyword identifier",
            example: "minLength" 
          },
        },
        required: ["field", "message"],
      },
    },
  },
  required: ["success", "message"],
} as const;

export const createNoteValidationErrorSchema = {
  $id: "createNoteValidationError",
  type: "object",
  description: "Create Note request validation error details",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Validation failed." },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string", example: "title" },
          message: { type: "string", example: "must have required property 'title'" },
          code: { type: "string", example: "required" },
        },
        required: ["field", "message"],
      },
    },
  },
  required: ["success", "message"],
} as const;

export const getNotesValidationErrorSchema = {
  $id: "getNotesValidationError",
  type: "object",
  description: "Get Notes query validation error details",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Validation failed." },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string", example: "sortOrder" },
          message: { type: "string", example: "must be equal to one of the allowed values" },
          code: { type: "string", example: "enum" },
        },
        required: ["field", "message"],
      },
    },
  },
  required: ["success", "message"],
} as const;

export const updateNoteValidationErrorSchema = {
  $id: "updateNoteValidationError",
  type: "object",
  description: "Update Note request validation error details",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Validation failed." },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string", example: "title" },
          message: { type: "string", example: "must NOT have fewer than 1 characters" },
          code: { type: "string", example: "minLength" },
        },
        required: ["field", "message"],
      },
    },
  },
  required: ["success", "message"],
} as const;

export const exportNotesValidationErrorSchema = {
  $id: "exportNotesValidationError",
  type: "object",
  description: "Export Notes query validation error details",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Validation failed." },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string", example: "format" },
          message: { type: "string", example: "must be equal to one of the allowed values" },
          code: { type: "string", example: "enum" },
        },
        required: ["field", "message"],
      },
    },
  },
  required: ["success", "message"],
} as const;

export const importNotesValidationErrorSchema = {
  $id: "importNotesValidationError",
  type: "object",
  description: "Import Notes request error details",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Only JSON files are supported for import" },
  },
  required: ["success", "message"],
} as const;
