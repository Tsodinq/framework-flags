import { existsSync, writeFileSync } from "fs";
import { Flag, FlagBag } from "./flag";

/**
 * Used to validate a bucket file is ready to be created.
 * (i.e. it doesn't already exist)
 *
 * @param path Path to bucket file
 * @returns True if bucket file is ready to be created
 */
function isBucketFileReady(path: string): boolean {
  return !existsSync(path);
}

/**
 * Create a flag bucket that can be used to store flags, typically
 * one per instance.
 * @param dir Directory of flag bucket
 * @returns FlagBag
 */
function createFlagBuckets(dir: string = process.cwd()): FlagBag {
  Array.from([`${dir}/flags.dev.json`, `${dir}/flags.prod.json`]).forEach(
    (path) => {
      if (isBucketFileReady(path)) {
        try {
          writeFileSync(
            path,
            JSON.stringify({
              _apikey: Array.from({ length: 32 }, () =>
                Math.floor(Math.random() * 16).toString(16)
              ).join(""),
            }),
            { encoding: "utf8" }
          );
          console.log(`Created flag bucket at ${path}`);
        } catch (err: any) {
          throw new Error(
            `Failed to create flag bucket: ${err.message || "Unknown error"}`
          );
        }
      }
    }
  );

  return {};
}

/**
 * Get a flag bucket from an environment (prod | dev)
 *
 * @param env Environment to get flag bucket from
 * @returns FlagBag
 */
function getFlagBucket(env: "prod" | "dev"): FlagBag {
  const dir = process.cwd();
  const path = `${dir}/flags.${env}.json`;

  if (!existsSync(path)) {
    throw new Error(`Flag bucket for environment ${env} does not exist`);
  }

  try {
    const data = require(path);
    return data;
  } catch (err: any) {
    throw new Error(
      `Failed to get flag bucket: ${err.message || "Unknown error"}`
    );
  }
}

/**
 * Check if a bucket already exists
 *
 * @returns True if bucket exists
 */
function bucketExists(): boolean {
  const dir = process.cwd();
  const paths = Array.from([`${dir}/flags.dev.json`, `${dir}/flags.prod.json`]);

  return paths.some((path) => existsSync(path));
}

/**
 * Update a flag by it's key
 *
 * @param env Environment to update flag in
 * @param key Key of flag to update
 * @param value Value of flag to update
 * @returns True if flag was updated
 */
function updateFlag(env: "prod" | "dev", key: string, value: Flag): boolean {
  const bucket = getFlagBucket(env);
  bucket[key] = value;

  const dir = process.cwd();
  const path = `${dir}/flags.${env}.json`;

  try {
    writeFileSync(path, JSON.stringify(bucket), { encoding: "utf8" });
    return true;
  } catch (err: any) {
    throw new Error(`Failed to update flag: ${err.message || "Unknown error"}`);
  }
}

/**
 * Delete a flag by it's key
 *
 * @param env Environment to delete flag from
 * @param key Key of flag to delete
 * @returns True if flag was deleted
 */
function deleteFlag(env: "prod" | "dev", key: string): boolean {
  const bucket = getFlagBucket(env);

  if (bucket[key] === undefined) {
    return false;
  }

  delete bucket[key];

  const dir = process.cwd();
  const path = `${dir}/flags.${env}.json`;

  try {
    writeFileSync(path, JSON.stringify(bucket), { encoding: "utf8" });
    return true;
  } catch (err: any) {
    throw new Error(`Failed to delete flag: ${err.message || "Unknown error"}`);
  }
}

/**
 * Create a flag
 * @param env Environment to create flag in
 * @param key Key of flag to create
 * @param value Value of flag to create
 * @returns True if flag was created
 */
function createFlag(env: "prod" | "dev", key: string, value: Flag): boolean {
  const bucket = getFlagBucket(env);

  if (bucket[key] !== undefined) {
    return false;
  }

  bucket[key] = value;

  const dir = process.cwd();
  const path = `${dir}/flags.${env}.json`;

  try {
    writeFileSync(path, JSON.stringify(bucket), { encoding: "utf8" });
    return true;
  } catch (err: any) {
    throw new Error(`Failed to create flag: ${err.message || "Unknown error"}`);
  }
}

export {
  createFlagBuckets,
  getFlagBucket,
  bucketExists,
  updateFlag,
  deleteFlag,
  createFlag,
};
