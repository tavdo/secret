import { Router } from "express";
import { body, param, query } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { clampTake } from "../../utils/pagination.js";
import { adminSvc } from "../../services/admin.service.js";

export const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(authorize("ADMIN"));

adminRouter.get(
  "/users",
  query("take").optional(),
  query("cursor").optional(),
  validateReq,
  asyncHandler(async (req, res) => {
    const takeRaw = clampTake(req.query.take, 100);
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    res.json(await adminSvc.listUsers(takeRaw, cursor));
  })
);

adminRouter.patch(
  "/users/:id/status",
  [param("id").isString(), body("status").isIn(["ACTIVE", "SUSPENDED", "BANNED"]), validateReq],
  asyncHandler(async (req, res) => {
    await adminSvc.setAccountStatus(req.params.id, req.body.status);
    res.json({ ok: true });
  })
);

adminRouter.get(
  "/profiles",
  query("take").optional(),
  query("cursor").optional(),
  query("q").optional().isString(),
  validateReq,
  asyncHandler(async (req, res) => {
    const takeRaw = clampTake(req.query.take, 200);
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    res.json(await adminSvc.listProfiles(takeRaw, cursor, q));
  })
);

adminRouter.get(
  "/profiles/:profileId",
  [param("profileId").isString(), validateReq],
  asyncHandler(async (req, res) => {
    res.json(await adminSvc.getProfile(req.params.profileId));
  })
);

adminRouter.post(
  "/profiles",
  [
    body("displayName").trim().isLength({ min: 2, max: 120 }),
    body("handle").optional().isString(),
    body("email").optional().trim().isEmail(),
    body("password").optional().isString().isLength({ min: 10, max: 128 }),
    body("age").optional().isInt({ min: 18, max: 120 }),
    body("city").trim().isLength({ min: 1, max: 120 }),
    body("bio").optional().isString(),
    body("hourlyRate").optional().isInt({ min: 0, max: 1_000_000 }),
    body("vip").optional().isBoolean(),
    body("available").optional().isBoolean(),
    body("hidden").optional().isBoolean(),
    body("featured").optional().isBoolean(),
    body("avatar").optional().isString(),
    body("gallery").optional().isArray({ max: 40 }),
    body("gallery.*").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const created = await adminSvc.createProfile(req.body as never);
    res.status(201).json(created);
  })
);

adminRouter.patch(
  "/profiles/:profileId",
  [
    param("profileId").isString(),
    body("displayName").optional().trim().isLength({ min: 2, max: 120 }),
    body("handle").optional().isString(),
    body("age").optional({ nullable: true }).isInt({ min: 18, max: 120 }),
    body("city").optional().trim().isLength({ min: 1, max: 120 }),
    body("bio").optional().isString(),
    body("hourlyRate").optional().isInt({ min: 0, max: 1_000_000 }),
    body("vip").optional().isBoolean(),
    body("available").optional().isBoolean(),
    body("hidden").optional().isBoolean(),
    body("featured").optional().isBoolean(),
    body("avatar").optional().isString(),
    body("gallery").optional().isArray({ max: 40 }),
    body("gallery.*").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const updated = await adminSvc.updateProfile(req.params.profileId, req.body as never);
    res.json(updated);
  })
);

adminRouter.delete(
  "/profiles/:profileId",
  [param("profileId").isString(), validateReq],
  asyncHandler(async (req, res) => {
    res.json(await adminSvc.deleteProfile(req.params.profileId));
  })
);

adminRouter.patch(
  "/profiles/:profileId/moderate",
  [
    param("profileId").isString(),
    body("verificationStatus").optional().isIn(["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"]),
    body("vipBadge").optional().isBoolean(),
    body("active").optional().isBoolean(),
    body("moderatedNote").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    await adminSvc.moderateProfile(req.params.profileId, {
      verificationStatus: req.body.verificationStatus,
      vipBadge:
        typeof req.body.vipBadge === "boolean" ? req.body.vipBadge : undefined,
      active: typeof req.body.active === "boolean" ? req.body.active : undefined,
      moderatedNote:
        typeof req.body.moderatedNote === "string" ? req.body.moderatedNote : undefined,
      moderatedByUserId: req.auth!.userId,
    });
    res.json({ ok: true });
  })
);

adminRouter.post(
  "/profiles/:profileId/vip",
  [
    param("profileId").isString(),
    body("planName").isString(),
    body("months").isInt({ min: 1, max: 120 }),
    body("externalRef").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const created = await adminSvc.createVipSubscription(req.params.profileId, {
      planName: req.body.planName,
      months: Number(req.body.months),
      externalRef: typeof req.body.externalRef === "string" ? req.body.externalRef : undefined,
    });
    res.status(201).json(created);
  })
);

adminRouter.get(
  "/reports",
  query("take").optional(),
  query("status").optional().isString(),
  validateReq,
  asyncHandler(async (req, res) => {
    const takeRaw = clampTake(req.query.take, 100);
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const rows = await adminSvc.listReports(takeRaw, status);
    res.json(rows);
  })
);

adminRouter.patch(
  "/reports/:reportId",
  [
    param("reportId").isString(),
    body("status").isIn(["IN_REVIEW", "RESOLVED", "DISMISSED"]),
    body("resolvedNote").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const updated = await adminSvc.handleReport(req.params.reportId, {
      status: req.body.status,
      resolvedNote:
        typeof req.body.resolvedNote === "string" ? req.body.resolvedNote : undefined,
    });
    res.json(updated);
  })
);

adminRouter.get("/analytics", asyncHandler(async (_req, res) => {
  res.json(await adminSvc.analyticsSnapshot());
}));

adminRouter.post("/setup/demo-categories", asyncHandler(async (_req, res) => {
  await adminSvc.ensureDefaultCategories([
    { name: "General", slug: "general" },
    { name: "Premium", slug: "premium" },
    { name: "Events", slug: "events" },
    { name: "Travel", slug: "travel" },
    { name: "Consulting", slug: "consulting" },
  ]);
  res.json({ ok: true });
}));
