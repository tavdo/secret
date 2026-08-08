import { Router } from "express";
import { body } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { authLimiter } from "../../middleware/security.js";
import { authSvc } from "../../services/auth.service.js";
import { authenticate } from "../../middleware/auth.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  authLimiter,
  [
    body("email").trim().toLowerCase().isEmail(),
    body("password").isString().isLength({ min: 10, max: 128 }).withMessage("Password too weak"),
    body("requestedRole").optional().isIn(["USER", "PROVIDER"]),
    body("displayName").trim().isLength({ min: 2, max: 120 }),
    body("bio").trim().isLength({ min: 1, max: 6000 }),
    body("city").trim().isLength({ min: 1, max: 120 }),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const u = await authSvc.register(req.body as never);
    res.status(201).json(u);
  })
);

authRouter.post(
  "/login",
  authLimiter,
  [body("email").trim().toLowerCase().isEmail(), body("password").isString(), validateReq],
  asyncHandler(async (req, res) => {
    const tokens = await authSvc.login(req.body as never);
    res.json(tokens);
  })
);

/** One-time: create first ADMIN when none exist. */
authRouter.post(
  "/bootstrap-admin",
  authLimiter,
  [
    body("email").trim().toLowerCase().isEmail(),
    body("password").isString().isLength({ min: 8, max: 128 }).withMessage("Password too weak"),
    body("displayName").optional().trim().isLength({ min: 2, max: 120 }),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const tokens = await authSvc.bootstrapAdmin(req.body as never);
    res.status(201).json(tokens);
  })
);

authRouter.post(
  "/refresh",
  authLimiter,
  [body("refreshToken").isString(), validateReq],
  asyncHandler(async (req, res) => {
    const tokens = await authSvc.refreshTokens({ refreshJwt: req.body.refreshToken });
    res.json(tokens);
  })
);

authRouter.post("/verify-email", authLimiter, [body("token").isString(), validateReq], asyncHandler(async (req, res) => {
  await authSvc.verifyEmail(req.body.token);
  res.json({ ok: true });
}));

authRouter.post(
  "/logout",
  authenticate,
  asyncHandler(async (req, res) => {
    const revokeAll = Boolean(req.body?.revokeAllSessions);
    let refreshJwt: string | undefined;
    if (typeof req.body?.refreshToken === "string") refreshJwt = req.body.refreshToken;

    await authSvc.logout({
      userId: req.auth!.userId,
      refreshJwt,
      revokeAllSessions: revokeAll,
    });
    res.json({ ok: true });
  })
);

authRouter.post(
  "/forgot-password",
  authLimiter,
  [body("email").trim().toLowerCase().isEmail(), validateReq],
  asyncHandler(async (req, res) => {
    await authSvc.requestPasswordReset(req.body.email);
    res.json({ ok: true });
  })
);

authRouter.post(
  "/reset-password",
  authLimiter,
  [
    body("token").isString(),
    body("password").isString().isLength({ min: 10, max: 128 }).withMessage("Password too weak"),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    await authSvc.resetPassword(req.body.token, req.body.password);
    res.json({ ok: true });
  })
);
