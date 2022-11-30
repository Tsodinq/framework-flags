import { getFlagBucket } from "./fs";

/**
 * Validate an API key
 *
 * @param key The API key to validate
 * @param env The environment to validate the API key for
 * @returns True if the API key is valid
 */
function validateKey(key: string, env: "prod" | "dev"): boolean {
  const bucket = getFlagBucket(env);
  return bucket._apikey === key;
}

export { validateKey };
