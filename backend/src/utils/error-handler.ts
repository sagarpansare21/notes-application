import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";
import { ApiError } from "./api-error";
import { errorResponse } from "./api-response";
import { config } from "../config";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  // Log the error using the request logger
  request.log.error(error);

  // 1. Handle custom ApiError
  if (error instanceof ApiError) {
    reply.status(error.statusCode).send(errorResponse(error.message));
    return;
  }

  // 2. Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // Unique constraint violation
        reply.status(409).send(errorResponse("A record with this value already exists."));
        return;
      case "P2025": // Record not found
        reply.status(404).send(errorResponse("Record not found."));
        return;
      case "P2003": // Foreign key constraint violation
        reply.status(409).send(errorResponse("Foreign key constraint failed."));
        return;
      default:
        reply.status(400).send(errorResponse("Database operation failed."));
        return;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    reply.status(400).send(errorResponse("Database validation failed."));
    return;
  }

  // 3. Handle Fastify validation errors
  if (error.validation) {
    const errors = error.validation.map((err) => {
      const field = err.instancePath
        ? err.instancePath.substring(1)
        : (err.params["missingProperty"] as string | undefined) || "field";
      return {
        field,
        message: err.message || "Invalid value",
        code: err.keyword,
      };
    });
    const validationMessage = errors.map((err) => `${err.field} ${err.message}`).join(", ");
    reply.status(400).send(errorResponse(`Validation failed: ${validationMessage}`, errors));
    return;
  }

  // 4. Handle other Fastify-specific errors with status code
  if (error.statusCode) {
    reply.status(error.statusCode).send(errorResponse(error.message));
    return;
  }

  // 5. Handle unknown errors
  const isProduction = config.nodeEnv === "production";
  const errorMessage = isProduction ? "Internal server error" : error.message;
  reply.status(500).send(errorResponse(errorMessage));
}

