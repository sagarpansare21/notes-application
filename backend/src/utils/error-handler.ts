import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";

import { config } from "../config";
import { ApiError } from "./api-error";
import { errorResponse } from "./api-response";
import { prismaErrorMap } from "./error-messages";

function handleApiError(error: ApiError, reply: FastifyReply) {
  return reply.status(error.statusCode).send(errorResponse(error.message));
}

function handlePrismaKnownError(
  error: Prisma.PrismaClientKnownRequestError,
  reply: FastifyReply
) {
  const prismaError = prismaErrorMap[error.code];

  if (!prismaError) {
    return reply
      .status(400)
      .send(errorResponse("Unable to process the request."));
  }

  return reply
    .status(prismaError.statusCode)
    .send(errorResponse(prismaError.message));
}

function handleValidationError(
  error: FastifyError,
  reply: FastifyReply
) {
  const errors =
    error.validation?.map((err) => ({
      field:
        err.instancePath?.replace("/", "") ||
        (typeof err.params?.missingProperty === "string"
          ? err.params.missingProperty
          : "field"),
      message: err.message ?? "Invalid value",
      code: err.keyword,
    })) ?? [];

  return reply.status(400).send(
    errorResponse("Validation failed.", errors)
  );
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  request.log.error(
    {
      requestId: request.id,
      method: request.method,
      url: request.url,
      error,
    },
    "Request failed"
  );

  // Business errors
  if (error instanceof ApiError) {
    handleApiError(error, reply);
    return;
  }

  // Prisma known errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaKnownError(error, reply);
    return;
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    reply
      .status(400)
      .send(errorResponse("Invalid data provided."));
    return;
  }

  // Prisma initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    reply
      .status(503)
      .send(errorResponse("Database service is currently unavailable."));
    return;
  }

  // Fastify request validation
  if (error.validation) {
    handleValidationError(error, reply);
    return;
  }

  // Fastify generated HTTP errors
  if (error.statusCode) {
    reply.status(error.statusCode).send(errorResponse(error.message));
    return;
  }

  // Unknown errors
  reply.status(500).send(
    errorResponse(
      config.nodeEnv === "production"
        ? "Internal server error."
        : error.message
    )
  );
}