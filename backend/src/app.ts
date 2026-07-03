import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import compress from "@fastify/compress";
import multipart from "@fastify/multipart";
import { prismaPlugin, swaggerPlugin } from "./plugins";
import { noteRoutes } from "./routes";
import {
  noteResponseSchema,
  createNoteSchema,
  updateNoteSchema,
  getNotesQuerySchema,
  tagsResponseSchema,
  apiErrorResponseSchema,
  apiValidationErrorResponseSchema,
  createNoteValidationErrorSchema,
  getNotesValidationErrorSchema,
  updateNoteValidationErrorSchema,
  exportNotesValidationErrorSchema,
  importNotesValidationErrorSchema,
} from "./schemas";
import { errorHandler } from "./utils";
import { config } from "./config";

export function buildApp(): FastifyInstance {
  const app = fastify({
    ajv: {
      customOptions: {
        keywords: ["example"],
      },
    },
    logger: {
      level: config.logLevel,
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
            hostname: request.hostname,
            remoteAddress: request.ip,
          };
        },
        res(reply) {
          return {
            statusCode: reply.statusCode,
          };
        },
      },
      transport:
        config.nodeEnv !== "production"
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
  });

  // Register CORS
  const isDev = config.nodeEnv !== "production";
  app.register(cors, {
    origin: isDev ? true : config.corsOrigin || false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  // Register security headers
  app.register(helmet, {
    contentSecurityPolicy: isDev ? false : undefined,
  });

  // Register response compression
  app.register(compress);

  // Register multipart upload support
  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  // Register plugins
  app.register(prismaPlugin);
  if (isDev) {
    app.register(swaggerPlugin);
  }
  app.register(noteRoutes, { prefix: "/api/v1" });

  // Register reusable schemas
  app.addSchema(noteResponseSchema);
  app.addSchema(createNoteSchema);
  app.addSchema(updateNoteSchema);
  app.addSchema(getNotesQuerySchema);
  app.addSchema(tagsResponseSchema);
  app.addSchema(apiErrorResponseSchema);
  app.addSchema(apiValidationErrorResponseSchema);
  app.addSchema(createNoteValidationErrorSchema);
  app.addSchema(getNotesValidationErrorSchema);
  app.addSchema(updateNoteValidationErrorSchema);
  app.addSchema(exportNotesValidationErrorSchema);
  app.addSchema(importNotesValidationErrorSchema);

  // Set global error handler
  app.setErrorHandler(errorHandler);

  return app;
}






