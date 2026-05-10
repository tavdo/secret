import { Router } from "express";
import { body, param, query } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { optionalAuthenticate } from "../../middleware/optionalAuth.js";
import { uploadMemory } from "../../middleware/upload.js";
import { AppError } from "../../utils/AppError.js";
import { profiles } from "../../services/profile.service.js";
import { clampTake, decodeCursor, encodeCursor } from "../../utils/pagination.js";
import { reviewsSvc } from "../../services/review.service.js";

export const profileRouter = Router();

profileRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await profiles.getMine(req.auth!.userId));
  })
);

profileRouter.patch(
  "/me",
  authenticate,
  [
    body("displayName").optional().trim().isLength({ min: 2, max: 120 }),
    body("bio").optional().trim().isLength({ min: 1, max: 6000 }),
    body("city").optional().trim().isLength({ min: 1, max: 120 }),
    body("availability").optional().isIn(["OFFLINE", "AVAILABLE", "BUSY"]),
    body("priceMin").optional({ nullable: true }).isInt({ min: 0, max: 1_000_000 }),
    body("priceMax").optional({ nullable: true }).isInt({ min: 0, max: 1_000_000 }),
    body("currency").optional({ nullable: true }).isString(),
    body("servicesText").optional({ nullable: true }).isString(),
    body("categoryIds").optional().isArray(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    res.json(await profiles.updateMine(req.auth!.userId, req.body as never));
  })
);

profileRouter.post(
  "/me/avatar",
  authenticate,
  uploadMemory.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError("file is required", 400);
    res.json(
      await profiles.setAvatarFromUpload({
        userId: req.auth!.userId,
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname,
      })
    );
  })
);

profileRouter.post(
  "/me/gallery",
  authenticate,
  uploadMemory.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError("file is required", 400);

    const raw = typeof req.body.vipLocked === "string" ? req.body.vipLocked : String(Boolean(req.body.vipLocked));

    const item = await profiles.appendGalleryFromUpload({
      userId: req.auth!.userId,
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalName: req.file.originalname,
      vipLocked: raw === "true" || req.body.vipLocked === true,
    });

    res.status(201).json(item);
  })
);

profileRouter.get(
  "/favorites/me",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await profiles.listMineFavorites(req.auth!.userId));
  })
);

profileRouter.post(
  "/:slug/favorite",
  authenticate,
  param("slug").trim().notEmpty(),
  validateReq,
  asyncHandler(async (req, res) => {
    res.json(await profiles.toggleFavorite(req.auth!.userId, req.params.slug));
  })
);

profileRouter.get(
  "/:slug/public",
  optionalAuthenticate,
  param("slug").trim().notEmpty(),
  validateReq,
  asyncHandler(async (req, res) => {
    const viewer = req.auth ? { userId: req.auth.userId, role: req.auth.role as string } : null;
    res.json(await profiles.getPublicBySlug(req.params.slug, viewer));
  })
);

profileRouter.get(
  "/:slug/reviews",
  optionalAuthenticate,
  param("slug").trim().notEmpty(),
  query("take").optional(),
  query("cursor").optional(),
  validateReq,
  asyncHandler(async (req, res) => {
    const take = clampTake(req.query.take, 50);
    const cursor = decodeCursor(typeof req.query.cursor === "string" ? req.query.cursor : undefined);

    const result = await reviewsSvc.listForProfile(req.params.slug, take, cursor);
    const nextCursor = result.nextCursor instanceof Date ? encodeCursor(result.nextCursor) : null;

    res.json({
      ...result,
      items: result.items,
      nextCursor,
    });
  })
);
