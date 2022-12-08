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

describe("get flags from different environments", () => {
  if (!bucketExists()) createFlagBuckets();

  test("GET /flags/dev", async () => {
    return await testGetRoute(supertest(app), "dev");
  });

  test("GET /flags/prod", async () => {
    return await testGetRoute(supertest(app), "prod");
  });
});

describe("update flags in different environments", () => {
  if (!bucketExists()) createFlagBuckets();
  createFlag("dev", "test", "waiting...");
  createFlag("prod", "test", "waiting...");

  test("PATCH /flags/dev/:key", async () => {
    return await testUpdateRoute(supertest(app), "dev", "test", "updated").then(
      () => {
        deleteFlag("dev", "test");
      }
    );
  });

  test("PATCH /flags/prod/:key", async () => {
    return await testUpdateRoute(
      supertest(app),
      "prod",
      "test",
      "updated"
    ).then(() => {
      deleteFlag("prod", "test");
    });
  });
});

afterAll(() => {
  server.close();
});
