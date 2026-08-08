import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { env } from "../config/env.js";
import type { Role } from "@prisma/client";

export type AccessPayload = {
  sub: string;
  role: Role;
  typ: "access";
};

export type RefreshPayload = {
  sub: string;
  typ: "refresh";
};

export function signAccessToken(userId: string, role: Role): string {
  return jwt.sign(
    { sub: userId, role, typ: "access", jti: randomBytes(8).toString("hex") },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_ACCESS_TTL_SECONDS,
      issuer: env.JWT_ISSUER,
    }
  );
}

export function signRefreshToken(userId: string): string {
  return jwt.sign(
    { sub: userId, typ: "refresh", jti: randomBytes(16).toString("hex") },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_TTL_SECONDS,
      issuer: env.JWT_ISSUER,
    }
  );
}

export function verifyAccess(token: string): AccessPayload {
  const p = jwt.verify(token, env.JWT_SECRET, { issuer: env.JWT_ISSUER }) as AccessPayload & jwt.JwtPayload;
  return { sub: p.sub, role: p.role as Role, typ: "access" };
}

export function verifyRefresh(token: string): RefreshPayload {
  const p = jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: env.JWT_ISSUER,
  }) as RefreshPayload & jwt.JwtPayload;
  return { sub: p.sub, typ: "refresh" };
}
