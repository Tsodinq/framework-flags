import { Request, Response } from "express";
import { validateEnv } from "../api-utils";
import { errors } from "../errors";
import { getFlagBucket } from "../fs";

function getFlagsEndpoint(request: Request, response: Response) {
  const { env } = request.params as {
    env: "prod" | "dev";
  };

  if (!validateEnv(env)) {
    response.status(400).json({
      error: errors.INVALID_ENVIRONMENT,
    });
  }

  const bucket = getFlagBucket(env);
  response.status(200).json(
    Object.keys(bucket).reduce((acc, key) => {
      if (!key.startsWith("_")) {
        acc[key] = bucket[key];
      }
      return acc;
    }, {} as Record<string, any>)
  );
}

export { getFlagsEndpoint };
