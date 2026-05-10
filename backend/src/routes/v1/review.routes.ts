import { Router } from "express";
import { body } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { reviewsSvc } from "../../services/review.service.js";

export const reviewRouter = Router();

reviewRouter.post(
  "/",
  authenticate,
  [
    body("bookingId").isString(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const r = await reviewsSvc.create({
      reviewerUserId: req.auth!.userId,
      bookingId: req.body.bookingId,
      rating: Number(req.body.rating),
      comment: typeof req.body.comment === "string" ? req.body.comment : undefined,
    });
    res.status(201).json(r);
  })
);
