import type { RequestHandler } from "express";
import type { Role } from "@prisma/client";
import { verifyAccess } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

/** Requires `Authorization: Bearer <accessJWT>`. */
export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const h = req.header("authorization");
    const token = h?.startsWith("Bearer ") ? h.slice("Bearer ".length).trim() : undefined;
    if (!token) throw new AppError("Unauthorized", 401);

    let payload: ReturnType<typeof verifyAccess>;
    try {
      payload = verifyAccess(token);
    } catch {
      throw new AppError("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        role: true,
        accountStatus: true,
        lockoutUntil: true,
      },
    });

    if (!user || user.accountStatus !== "ACTIVE") throw new AppError("Unauthorized", 401);
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      throw new AppError("Account temporarily locked", 423);
    }

    req.auth = { userId: user.id, role: user.role as Role };
    next();
  } catch (e) {
    next(e);
  }
};

export function authorize(...roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) return next(new AppError("Unauthorized", 401));
    if (!roles.includes(req.auth.role)) return next(new AppError("Forbidden", 403));
    next();
  };
}
