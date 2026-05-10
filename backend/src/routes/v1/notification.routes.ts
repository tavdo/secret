import { Router } from "express";
import { param, query } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { notifications } from "../../services/notification.service.js";
import { clampTake, decodeCursor, encodeCursor } from "../../utils/pagination.js";

export const notificationRouter = Router();
notificationRouter.use(authenticate);

notificationRouter.get(
  "/",
  query("take").optional(),
  query("cursor").optional(),
  query("unread").optional().isIn(["true", "false"]),
  validateReq,
  asyncHandler(async (req, res) => {
    const take = clampTake(req.query.take, 50);
    const unreadOnly =
      typeof req.query.unread === "string" ? req.query.unread === "true" : false;
    const cursor = decodeCursor(typeof req.query.cursor === "string" ? req.query.cursor : undefined);

    const rows = await notifications.listMine(req.auth!.userId, unreadOnly, take, cursor);

    const hasMore = rows.length > take;
    const items = hasMore ? rows.slice(0, take) : rows;
    const nextCursorEncoded =
      hasMore && items.length > 0
        ? encodeCursor(items[items.length - 1]!.createdAt)
        : null;

    res.json({ items, nextCursor: nextCursorEncoded });
  })
);

notificationRouter.patch(
  "/:id/read",
  [param("id").isString(), validateReq],
  asyncHandler(async (req, res) => {
    const n = await notifications.markRead(req.auth!.userId, req.params.id);
    if (!n) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(n);
  })
);
