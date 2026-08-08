import express from "express";
import { applySecurityMiddleware } from "./middleware/security.js";
import { requestId } from "./middleware/requestId.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { v1Routes } from "./routes/v1/index.js";

export function createApp(): express.Application {
  const app = express();

  app.disable("x-powered-by");
  applySecurityMiddleware(app);

  app.use(requestId);

  /** Keep payload sizes bounded (spam / abuse mitigation). */
  app.use(express.json({ limit: "200kb" }));
  app.use(express.urlencoded({ extended: false }));

  app.get("/healthz", (_req, res) => {
    res.json({ ok: true });
  });
  // Vercel Services mount the API under /api/*
  app.get("/api/healthz", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/v1", v1Routes);
  app.use("/api/v1", v1Routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
