import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { config } from "../config";

const swaggerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Notes API",
        description: "API for managing personal notes",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${config.port}`,
          description: "Development Server",
        },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });
});

export default swaggerPlugin;
