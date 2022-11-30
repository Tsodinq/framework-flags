import { Request, Response } from "express";
import { validateApiKey } from "../api-utils";
import { errors } from "../errors";
import { deleteFlag, getFlagBucket } from "../fs";

function deleteFlagEndpoint(req: Request, res: Response) {
  const { env, key } = req.params as {
    env: "prod" | "dev";
    key: string;
  };

  if (!validateApiKey(req, res)) return;

  if (key === undefined) {
    res.status(400).json({
      error: errors.INVALID_REQUEST,
      reason: "Missing key",
    });
  }

  const bucket = getFlagBucket(env);

  if (bucket[key] === undefined) {
    res.status(404).json({
      error: errors.FLAG_NOT_FOUND,
    });
  }

  if (deleteFlag(env, key)) {
    res.status(200).json({
      message: "Flag deleted successfully",
    });
  } else {
    res.status(500).json({
      error: errors.UNKNOWN_ERROR,
    });
  }
}

export { deleteFlagEndpoint };
