import { Request, Response } from "express";
import { validateApiKey } from "../api-utils";
import { errors } from "../errors";
import { FlagBag } from "../flag";
import { deleteFlag, getFlagBucket } from "../fs";

function deleteFlagEndpoint(req: Request, res: Response) {
  const { key } = req.params as {
    key: string;
  };

  if (!validateApiKey(req, res, true)) return;

  if (key === undefined) {
    res.status(400).json({
      error: errors.INVALID_REQUEST,
      reason: "Missing key",
    });
  }

  const buckets = [getFlagBucket("dev"), getFlagBucket("prod")];

  if (buckets.every((bucket: FlagBag) => bucket[key] === undefined)) {
    res.status(404).json({
      error: errors.FLAG_NOT_FOUND,
    });
  }

  try {
    deleteFlag("dev", key);
    deleteFlag("prod", key);
  } catch (e) {
    res.status(500).json({
      error: errors.UNKNOWN_ERROR,
    });
  }

  res.status(200).json({
    message: "Flag deleted",
  });
}

export { deleteFlagEndpoint };
