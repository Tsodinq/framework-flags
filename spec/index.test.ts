import supertest from "supertest";
import { app } from "../src/app";
import { server } from "../src/server";
import { FlagBag } from "../src/flag";
import {
  bucketExists,
  createFlag,
  createFlagBuckets,
  deleteFlag,
  getFlagBucket,
} from "../src/fs";

beforeAll(async () => {
  if (!bucketExists()) await Promise.all([createFlagBuckets()]);
});

function emitKey(bucket: FlagBag): FlagBag {
  const { _apikey, ...rest } = bucket;
  return rest;
}

async function testGetRoute(
  supertest: supertest.SuperTest<supertest.Test>,
  env: "dev" | "prod"
) {
  return supertest
    .get(`/flags/${env}`)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(emitKey(getFlagBucket(env)));
    });
}

async function testUpdateRoute(
  supertest: supertest.SuperTest<supertest.Test>,
  env: "dev" | "prod",
  key: string,
  value: string
) {
  return supertest
    .patch(`/flags/${env}/${key}`)
    .set("Authorization", `Bearer ${getFlagBucket(env)._apikey}`)
    .send({ value })
    .expect(200)
    .expect((res) => {
      expect(res.body.message).toEqual("Flag updated successfully");
    });
}

const envs = ["dev", "prod"];

describe("get flags from different environments", () => {
  if (!bucketExists()) createFlagBuckets();

  envs.forEach((env) => {
    test(`GET /flags/${env}`, async () => {
      return await testGetRoute(supertest(app), env);
    });
  });
});

describe("update flags in different environments", () => {
  if (!bucketExists()) createFlagBuckets();
  envs.forEach((env) => {
    createFlag(env, "test", "waiting...");
  });

  envs.forEach((env) => {
    test(`PATCH /flags/${env}/:key`, async () => {
      return await testUpdateRoute(supertest(app), env, "test", "updated").then(
        () => {
          deleteFlag(env, "test");
        }
      );
    });
  });
});

afterAll(() => {
  server.close();
});
