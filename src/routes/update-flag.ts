import { Request, Response } from "express";
import { validateApiKey } from "../api-utils";
import { errors } from "../errors";
import { Flag } from "../flag";
import { getFlagBucket, updateFlag } from "../fs";

function updateFlagEndpoint(req: Request, res: Response) {
  const { env, key } = req.params as {
    env: "prod" | "dev";
    key: string;
  };
  const { value } = req.body as {
    value: Flag;
  };

  if (!validateApiKey(req, res)) return;

  if (
    key === undefined ||
    value === undefined ||
    (typeof value !== "string" &&
      typeof value !== "boolean" &&
      typeof value !== "number")
  ) {
    res.status(400).json({
      error: errors.INVALID_REQUEST,
      reason: "Missing key or value",
    });
  }

  const bucket = getFlagBucket(env);

  if (bucket[key] === undefined) {
    res.status(404).json({
      error: errors.FLAG_NOT_FOUND,
    });
  }

  if (updateFlag(env, key, value)) {
    res.status(200).json({
      message: "Flag updated successfully",
    });
  } else {
    res.status(500).json({
      error: errors.COULDNT_UPDATE_FLAG,
    });
  }
}

export { updateFlagEndpoint };
