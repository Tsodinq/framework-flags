import { Request, Response } from "express";
import { validateApiKey } from "../api-utils";
import { errors } from "../errors";
import { Flag, FlagBag } from "../flag";
import { createFlag, getFlagBucket } from "../fs";

function createFlagEndpoint(req: Request, res: Response) {
  const { key } = req.params as {
    key: string;
  };
  const { value } = req.body as {
    value: Flag;
  };

  if (!validateApiKey(req, res, true)) return;

  if (
    key === undefined ||
    value === undefined ||
    (typeof value !== "string" &&
      typeof value !== "boolean" &&
      typeof value !== "number")
  ) {
    res.status(400).json({
      error: errors.INVALID_REQUEST,
      reason: "Missing key",
    });
  }

  const buckets = [getFlagBucket("dev"), getFlagBucket("prod")];

  if (buckets.some((bucket: FlagBag) => bucket[key] !== undefined)) {
    res.status(409).json({
      error: errors.FLAG_ALREADY_EXISTS,
    });
  }

  try {
    createFlag("dev", key, value);
    createFlag("prod", key, value);
  } catch (e) {
    res.status(500).json({
      error: errors.UNKNOWN_ERROR,
    });
  }

  res.status(200).json({
    message: "Flag created",
  });
}

export { createFlagEndpoint };
