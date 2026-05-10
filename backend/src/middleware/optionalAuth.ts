import type { RequestHandler } from "express";
import type { Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { verifyAccess } from "../utils/jwt.js";

/** If `Authorization` is absent/invalid, continue without `req.auth`. */
export const optionalAuthenticate: RequestHandler = async (req, _res, next) => {
  try {
    const h = req.header("authorization");
    const token = h?.startsWith("Bearer ") ? h.slice("Bearer ".length).trim() : undefined;
    if (!token) return next();

    const payload = verifyAccess(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, accountStatus: true },
    });

    if (user?.accountStatus === "ACTIVE") req.auth = { userId: user.id, role: user.role as Role };
    next();
  } catch {
    next(); // malformed tokens intentionally ignored here
  }
};
