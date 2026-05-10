import { Router } from "express";
import { body } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../config/prisma.js";

export const reportRouter = Router();

reportRouter.post(
  "/",
  authenticate,
  [
    body("category").isString().trim().isLength({ min: 2, max: 80 }),
    body("description").isString().trim().isLength({ min: 10, max: 8000 }),
    body("subjectUserId").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const r = await prisma.report.create({
      data: {
        reporterUserId: req.auth!.userId,
        category: req.body.category,
        description: req.body.description,
        subjectUserId: typeof req.body.subjectUserId === "string" ? req.body.subjectUserId : undefined,
      },
    });

    res.status(201).json(r);
  })
);
