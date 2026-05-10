import { Router } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../config/prisma.js";

export const categoryRouter = Router();

categoryRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json(rows);
  })
);
