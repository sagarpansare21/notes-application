import fastify, { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import { prismaPlugin } from "./plugins";

// Load environment variables
dotenv.config();

const logLevel = process.env["LOG_LEVEL"] || "info";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: {
      level: logLevel,
      transport:
        process.env["NODE_ENV"] !== "production"
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

  // Register plugins
  app.register(prismaPlugin);

  return app;
}

