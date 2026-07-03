import { buildApp } from "./app";
import { disconnectPrisma, config } from "./config";

const app = buildApp();

const start = async () => {
  const port = config.port;
  const host = config.host;

  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    await disconnectPrisma();
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  app.log.info({ signal }, "Received signal, shutting down gracefully");
  try {
    await app.close();
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

