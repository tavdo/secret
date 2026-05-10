import { Router } from "express";
import { body, param, query } from "express-validator";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateReq } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/auth.js";
import { messagingSvc } from "../../services/messaging.service.js";
import { clampTake, decodeCursor, encodeCursor } from "../../utils/pagination.js";

export const messagingRouter = Router();
messagingRouter.use(authenticate);

messagingRouter.post(
  "/rooms",
  [body("otherUserId").isString(), validateReq],
  asyncHandler(async (req, res) => {
    const room = await messagingSvc.getOrCreateRoom(req.auth!.userId, req.body.otherUserId);
    res.status(201).json(room);
  })
);

messagingRouter.get(
  "/rooms",
  query("take").optional(),
  query("cursor").optional(),
  validateReq,
  asyncHandler(async (req, res) => {
    const take = clampTake(req.query.take, 50);
    const cursor = decodeCursor(typeof req.query.cursor === "string" ? req.query.cursor : undefined);
    const result = await messagingSvc.listRooms(req.auth!.userId, take, cursor);
    const nextCursor = result.nextCursor instanceof Date ? encodeCursor(result.nextCursor) : null;
    res.json({ ...result, nextCursor });
  })
);

messagingRouter.get(
  "/rooms/:roomId/messages",
  param("roomId").isString(),
  query("take").optional(),
  query("cursor").optional(),
  validateReq,
  asyncHandler(async (req, res) => {
    const take = clampTake(req.query.take, 50);
    const cursor = decodeCursor(typeof req.query.cursor === "string" ? req.query.cursor : undefined);
    const result = await messagingSvc.listMessages(req.params.roomId, req.auth!.userId, take, cursor);
    const nextCursor = result.nextCursor instanceof Date ? encodeCursor(result.nextCursor) : null;
    res.json({ ...result, nextCursor });
  })
);

messagingRouter.post(
  "/rooms/:roomId/messages",
  [
    param("roomId").isString(),
    body("body").isString().isLength({ min: 1, max: 8000 }),
    body("mediaUrl").optional().isString(),
    validateReq,
  ],
  asyncHandler(async (req, res) => {
    const msg = await messagingSvc.sendMessage(
      req.params.roomId,
      req.auth!.userId,
      req.body.body,
      req.body.mediaUrl ?? null
    );
    res.status(201).json(msg);
  })
);

messagingRouter.post(
  "/rooms/:roomId/read",
  [param("roomId").isString(), body("upToMessageId").optional().isString(), validateReq],
  asyncHandler(async (req, res) => {
    res.json(await messagingSvc.markSeen(req.params.roomId, req.auth!.userId, req.body.upToMessageId));
  })
);
