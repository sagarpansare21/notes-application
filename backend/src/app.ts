import fastify, { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { prismaPlugin, swaggerPlugin } from "./plugins";

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

  // Register CORS
  const isDev = process.env["NODE_ENV"] !== "production";
  app.register(cors, {
    origin: isDev
      ? true
      : process.env["CORS_ORIGIN"]
      ? process.env["CORS_ORIGIN"].split(",")
      : false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  // Register plugins
  app.register(prismaPlugin);
  app.register(swaggerPlugin);

  return app;
}



