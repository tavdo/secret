import { Router } from "express";
import { query } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { search } from "../../services/search.service.js";
import { clampTake, decodeCursor, encodeCursor } from "../../utils/pagination.js";

export const searchRouter = Router();

searchRouter.get(
  "/profiles",
  [
    query("city").optional().isString(),
    query("category").optional().isString(),
    query("minPrice").optional().isInt({ min: 0 }),
    query("maxPrice").optional().isInt({ min: 0 }),
    query("sort").optional().isIn(["trending", "recent", "rating"]),
    query("vip").optional().isIn(["1", "true", "yes"]),
    query("featured").optional().isIn(["1", "true", "yes"]),
    query("take").optional(),
    query("cursor").optional(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const take = clampTake(req.query.take, 50);
    const cursor = decodeCursor(typeof req.query.cursor === "string" ? req.query.cursor : undefined);
    const flag = (v: unknown) => v === "1" || v === "true" || v === "yes";

    const result = await search.discovery({
      city: typeof req.query.city === "string" ? req.query.city : undefined,
      categorySlug: typeof req.query.category === "string" ? req.query.category : undefined,
      minPrice:
        typeof req.query.minPrice === "string"
          ? Number(req.query.minPrice)
          : typeof req.query.minPrice === "number"
            ? req.query.minPrice
            : undefined,
      maxPrice:
        typeof req.query.maxPrice === "string"
          ? Number(req.query.maxPrice)
          : typeof req.query.maxPrice === "number"
            ? req.query.maxPrice
            : undefined,
      vipOnly: flag(req.query.vip),
      featuredOnly: flag(req.query.featured),
      sort:
        typeof req.query.sort === "string"
          ? (req.query.sort as "trending" | "recent" | "rating")
          : undefined,
      take,
      cursor,
    });

    const nextCursor =
      result.nextCursor instanceof Date ? encodeCursor(result.nextCursor) : null;
    res.json({ ...result, nextCursor });
  })
);
