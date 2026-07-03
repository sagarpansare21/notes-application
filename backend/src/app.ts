import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { prismaPlugin, swaggerPlugin } from "./plugins";
import {
  noteResponseSchema,
  createNoteSchema,
  updateNoteSchema,
  getNotesQuerySchema,
} from "./schemas";
import { errorHandler } from "./utils";
import { config } from "./config";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: {
      level: config.logLevel,
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

  // Register plugins
  app.register(prismaPlugin);
  app.register(swaggerPlugin);

  // Register reusable schemas
  app.addSchema(noteResponseSchema);
  app.addSchema(createNoteSchema);
  app.addSchema(updateNoteSchema);
  app.addSchema(getNotesQuerySchema);

  // Set global error handler
  app.setErrorHandler(errorHandler);

  return app;
}






