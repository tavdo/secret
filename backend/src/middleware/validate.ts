import { validationResult } from "express-validator";
import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";

/** Run after validators on a route chain. */
export const validateReq: RequestHandler = (req, _res, next) => {
  const r = validationResult(req);
  if (!r.isEmpty())
    throw new AppError(r.array({ onlyFirstError: true })[0]?.msg ?? "Invalid input", 422);
  next();
};
