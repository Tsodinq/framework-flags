import { NextFunction, Request, Response } from "express";
import { errors } from "./errors";

const rateLimit = new Map<string, number>();

function rateLimited(
  max: number,
  time: number,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = req.ip;
  if (rateLimit.has(key)) {
    const count = rateLimit.get(key)!;
    if (count && count >= max) {
      res.status(429).json({
        error: errors.TOO_MANY_REQUESTS,
      });
      return;
    } else {
      rateLimit.set(key, count + 1);
      setTimeout(() => rateLimit.delete(key), time);
      next();
    }
  } else {
    rateLimit.set(key, 1);
    setTimeout(() => rateLimit.delete(key), time);
    next();
  }
}

export { rateLimited };
