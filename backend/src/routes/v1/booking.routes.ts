import { Router } from "express";
import { body, param, query } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { bookings } from "../../services/booking.service.js";
import { clampTake, decodeCursor, encodeCursor } from "../../utils/pagination.js";

export const bookingRouter = Router();
bookingRouter.use(authenticate);

bookingRouter.post(
  "/",
  [
    body("providerUserId").isString(),
    body("startsAt").isISO8601(),
    body("endsAt").isISO8601(),
    body("note").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const b = await bookings.createRequest({
      clientUserId: req.auth!.userId,
      providerUserId: req.body.providerUserId,
      startsAt: new Date(req.body.startsAt),
      endsAt: new Date(req.body.endsAt),
      note: req.body.note,
    });
    res.status(201).json(b);
  })
);

bookingRouter.get(
  "/",
  query("take").optional(),
  query("cursor").optional(),
  query("role").optional().isIn(["client", "provider"]),
  validateReq,
  asyncHandler(async (req, res) => {
    const take = clampTake(req.query.take, 50);
    const cursor = decodeCursor(typeof req.query.cursor === "string" ? req.query.cursor : undefined);
    const roleSide =
      typeof req.query.role === "string" ? (req.query.role as "client" | "provider") : undefined;

    const result = await bookings.listForUser(req.auth!.userId, take, cursor, roleSide);
    const nextCursor = result.nextCursor instanceof Date ? encodeCursor(result.nextCursor) : null;
    res.json({ ...result, nextCursor });
  })
);

bookingRouter.get(
  "/:id",
  param("id").isString(),
  validateReq,
  asyncHandler(async (req, res) => {
    res.json(await bookings.getForUser(req.params.id, req.auth!.userId));
  })
);

bookingRouter.patch(
  "/:id/status",
  [
    param("id").isString(),
    body("status").isIn(["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"]),
    body("note").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    res.json(
      await bookings.setStatus(
        req.auth!.userId,
        req.params.id,
        req.body.status,
        typeof req.body.note === "string" ? req.body.note : undefined
      )
    );
  })
);
