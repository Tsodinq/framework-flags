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

app.get("/flags/:env", rateLimited.bind(null, 150, 1000), getFlagsEndpoint);
app.patch(
  "/flags/:env/:key",
  rateLimited.bind(null, 50, 60000),
  updateFlagEndpoint
);
app.delete(
  "/flags/:key",
  rateLimited.bind(null, 30, 60000),
  deleteFlagEndpoint
);
app.put("/flags/:key", rateLimited.bind(null, 50, 60000), createFlagEndpoint);

export { app };
