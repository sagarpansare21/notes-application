import { buildApp } from "./app";
import { disconnectPrisma, config } from "./config";

const app = buildApp();

const start = async () => {
  const port = config.port;
  const host = config.host;

  try {
    app.log.info({ port, host }, "Starting application server...");
    await app.listen({ port, host });
    app.log.info("Application server started successfully");
  } catch (err) {
    app.log.error(err, "Failed to start application server");
    await disconnectPrisma();
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  app.log.info({ signal }, "Received signal, shutting down gracefully");
  try {
    app.log.info("Closing HTTP server...");
    await app.close();
    app.log.info("Disconnecting Prisma Client...");
    await disconnectPrisma();
    app.log.info("Shutdown complete");
    process.exit(0);
  } catch (err) {
    app.log.error(err, "Error during shutdown");
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

start();

