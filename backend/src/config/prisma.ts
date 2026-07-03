import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { config } from "./env";

const adapter = new PrismaBetterSqlite3({
  url: config.databaseUrl,
});

// Singleton instance of Prisma Client using SQLite driver adapter
export const prisma = new PrismaClient({
  adapter,
  log: config.nodeEnv === "development" ? ["query", "info", "warn", "error"] : ["error"],
});

// Graceful shutdown helper
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}


