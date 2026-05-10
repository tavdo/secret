import type { MulterError } from "multer";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: "Not Found", path: req.path });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.requestId;

  const multerCode =
    typeof err === "object" && err !== null && "code" in err ? (err as MulterError).code : undefined;

  if (multerCode === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large", requestId });
  }
  if (multerCode === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ error: "Unexpected file upload field", requestId });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      requestId,
    });
  }

  // eslint-disable-next-line no-console
  console.error({ requestId, err });

  const message =
    env.NODE_ENV === "production" ? "Internal Server Error" : err instanceof Error ? err.message : "Error";

  return res.status(500).json({
    error: message,
    requestId,
  });
}
