import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const config = {
  nodeEnv: process.env["NODE_ENV"] || "development",
  port: process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 3000,
  host: process.env["HOST"] || "127.0.0.1",
  logLevel: process.env["LOG_LEVEL"] || "info",
  databaseUrl: process.env["DATABASE_URL"] || "file:./dev.db",
  corsOrigin: process.env["CORS_ORIGIN"] ? process.env["CORS_ORIGIN"].split(",") : null,
};
