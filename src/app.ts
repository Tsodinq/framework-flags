import { json } from "body-parser";
import dotenv from "dotenv";
import express from "express";
import { rateLimited } from "./ratelimit";
import { createFlagEndpoint } from "./routes/create-flag";
import { deleteFlagEndpoint } from "./routes/delete-flag";
import { getFlagsEndpoint } from "./routes/get-flags";
import { updateFlagEndpoint } from "./routes/update-flag";
import { startServer } from "./server";
import cors from "cors";

const app = express();

app.use(json());
app.use(cors());
dotenv.config();
startServer();

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
  "/flags/:key",
  (req, res, next) => rateLimited(30, 60000, req, res, next),
  deleteFlagEndpoint
);
app.put(
  "/flags/:key",
  (req, res, next) => rateLimited(50, 60000, req, res, next),
  createFlagEndpoint
);

export { app };
