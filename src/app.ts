import { json } from "body-parser";
import dotenv from "dotenv";
import express from "express";
import { bucketExists, createFlagBuckets } from "./fs";
import { rateLimited } from "./ratelimit";
import { createFlagEndpoint } from "./routes/create-flag";
import { deleteFlagEndpoint } from "./routes/delete-flag";
import { getFlagsEndpoint } from "./routes/get-flags";
import { updateFlagEndpoint } from "./routes/update-flag";

const app = express();

app.use(json());
dotenv.config();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port", process.env.PORT || 3000);
  if (!bucketExists()) createFlagBuckets();
});

app.get(
  "/flags/:env",
  (req, res, next) => rateLimited(150, 1000, req, res, next),
  getFlagsEndpoint
);
app.patch(
  "/flags/:env/:key",
  (req, res, next) => rateLimited(50, 60000, req, res, next),
  updateFlagEndpoint
);
app.delete(
  "/flags/:env/:key",
  (req, res, next) => rateLimited(30, 60000, req, res, next),
  deleteFlagEndpoint
);
app.put(
  "/flags/:env/:key",
  (req, res, next) => rateLimited(50, 60000, req, res, next),
  createFlagEndpoint
);
