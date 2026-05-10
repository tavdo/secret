import type { NextFunction, Request, RequestHandler, Response } from "express";

/** Wraps async route handlers so errors reach the global handler. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => void Promise.resolve(fn(req, res, next)).catch(next);
}
