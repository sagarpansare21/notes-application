import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const rawUrl = process.env["DATABASE_URL"] || "file:./dev.db";

const adapter = new PrismaBetterSqlite3({
  url: rawUrl,
});

// Singleton instance of Prisma Client using SQLite driver adapter
export const prisma = new PrismaClient({
  adapter,
  log: process.env["NODE_ENV"] === "development" ? ["query", "info", "warn", "error"] : ["error"],
});

// Graceful shutdown helper
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

