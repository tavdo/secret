import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import type { Express } from "express";
import { env } from "../config/env.js";

export function applySecurityMiddleware(app: Express) {
  app.set("trust proxy", 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        return cb(null, env.CORS_ORIGIN.includes(origin));
      },
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
      maxAge: 600,
    })
  );

  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 600,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests" },
    })
  );
}

export const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts; try later" },
});

export const burstLimiter = rateLimit({
  windowMs: 10_000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests (burst)" },
});
