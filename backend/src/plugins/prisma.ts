import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { prisma } from "../config/prisma";

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Decorate Fastify instance with the Prisma client
  fastify.decorate("prisma", prisma);

  // Register the onClose hook to disconnect Prisma Client on server close
  fastify.addHook("onClose", async (instance) => {
    instance.log.info("Disconnecting Prisma Client...");
    await prisma.$disconnect();
  });
});

export default prismaPlugin;
