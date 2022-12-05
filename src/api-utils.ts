import { Request, Response } from "express";
import { validateKey } from "./auth";
import { errors } from "./errors";

/**
 * Validate an environment
 *
 * @param env The environment to validate
 * @returns True if the environment is valid
 */
function validateEnv(env: string): env is "prod" | "dev" {
  if (!env || (env !== "prod" && env !== "dev")) {
    return false;
  }
  return true;
}

/**
 * Validate API key passed in request headers,
 * bearer token in 'Authorization' header
 *
 * @param request Express request object
 * @param response Express response object
 * @param anyEnv If true, any environment key is valid
 * @returns True if API key is valid
 */
function validateApiKey(request: Request, response: Response, anyEnv = false) {
  if (!anyEnv) {
    const { env } = request.params as {
      env: "prod" | "dev";
    };

    if (!validateEnv(env)) {
      response.status(400).json({
        error: errors.INVALID_ENVIRONMENT,
      });

      return false;
    }
  }

  const key = request.headers.authorization?.split(" ")[1];
  if (anyEnv) {
    if (!validateKey(String(key), "prod") && !validateKey(String(key), "dev")) {
      response.status(401).json({
        error: errors.INVALID_API_KEY,
      });

      return false;
    }
  } else {
    const { env } = request.params as {
      env: "prod" | "dev";
    };
    if (!key || !validateKey(key, env)) {
      response.status(401).json({
        error: errors.INVALID_API_KEY,
      });

      return false;
    }
  }

  return true;
}

export { validateEnv, validateApiKey };
