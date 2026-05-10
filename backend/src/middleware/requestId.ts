import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";

export const requestId: RequestHandler = (req, _res, next) => {
  req.requestId = req.header("x-request-id") ?? randomUUID();
  next();
};
