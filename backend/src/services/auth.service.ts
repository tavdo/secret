import bcrypt from "bcryptjs";
import type { AvailabilityStatus, PrismaClient, Role } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { hashToken, rawToken } from "../utils/tokenCrypto.js";
import { signAccessToken, signRefreshToken, verifyRefresh } from "../utils/jwt.js";
import { slugify } from "../utils/slugify.js";
import { env } from "../config/env.js";
import { sendTransactionalEmail } from "./email.service.js";

const bcryptRounds = 12;

/** Canonical ordering for pairwise chat uniqueness. */
export function orderedParticipants(aUserId: string, bUserId: string): [string, string] {
  return aUserId <= bUserId ? [aUserId, bUserId] : [bUserId, aUserId];
}

export class AuthService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async register(input: {
    email: string;
    password: string;
    requestedRole?: Role;
    displayName: string;
    bio: string;
    city: string;
  }) {
    const email = input.email.trim().toLowerCase();

    if (input.requestedRole === "ADMIN") throw new AppError("Invalid role selection");

    const role: Role =
      input.requestedRole === "PROVIDER"
        ? "PROVIDER"
        : input.requestedRole === "USER"
          ? "USER"
          : "USER";

    const existing = await this.db.user.findUnique({ where: { email } });
    if (existing) throw new AppError("Email already in use");

    const passwordHash = await bcrypt.hash(input.password, bcryptRounds);

    const suffix = randomBytes(3).toString("hex");
    const slug = slugify(input.displayName, suffix);

    const emailTokenRaw = rawToken();
    const emailTokHash = hashToken(emailTokenRaw);
    const emailExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const created = await this.db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role,
          emailVerified: false,
        },
        select: {
          id: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          accountStatus: true,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          displayName: input.displayName.trim(),
          slug,
          bio: input.bio.trim(),
          city: input.city.trim(),
          availability: "OFFLINE" as AvailabilityStatus,
        },
      });

      await tx.emailVerificationToken.deleteMany({ where: { userId: user.id } });
      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash: emailTokHash,
          expiresAt: emailExpiresAt,
        },
      });

      return user;
    });

    const verificationUrl = `${env.APP_PUBLIC_URL}/verify-email?token=${encodeURIComponent(emailTokenRaw)}`;
    await sendTransactionalEmail({
      to: email,
      subject: "Verify your email",
      text: `Click to verify:\n${verificationUrl}\n\nExpires in 24h.`,
    });

    return created;
  }

  async login(input: { email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    const user = await this.db.user.findUnique({ where: { email } });

    if (!user) throw new AppError("Invalid credentials", 401);

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      throw new AppError("Account temporarily locked", 423);
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      const fails = user.failedLoginAttempts + 1;
      const patch: { failedLoginAttempts: number; lockoutUntil?: Date } = {
        failedLoginAttempts: fails,
      };
      if (fails >= 12) patch.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
      await this.db.user.update({ where: { id: user.id }, data: patch });
      throw new AppError("Invalid credentials", 401);
    }

    if (user.accountStatus !== "ACTIVE") throw new AppError("Account is not active", 403);

    await this.db.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockoutUntil: null, lastLoginAt: new Date() },
    });

    const access = signAccessToken(user.id, user.role as Role);
    const refreshJwt = signRefreshToken(user.id);
    const rtHash = hashToken(refreshJwt);
    const refreshExpiresMs = env.JWT_REFRESH_TTL_SECONDS * 1000;

    await this.db.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: rtHash,
        expiresAt: new Date(Date.now() + refreshExpiresMs),
      },
    });

    await this.touchProfileActivity(user.id);

    return {
      accessToken: access,
      refreshToken: refreshJwt,
      userId: user.id,
      role: user.role as Role,
      emailVerified: user.emailVerified,
    };
  }

  async logout(input: {
    userId: string;
    revokeAllSessions?: boolean;
    refreshJwt?: string;
  }) {
    if (input.revokeAllSessions) {
      await this.db.refreshToken.deleteMany({ where: { userId: input.userId } });
      return;
    }

    if (!input.refreshJwt) {
      throw new AppError("Provide refreshToken or set revokeAllSessions=true", 400);
    }

    try {
      const payload = verifyRefresh(input.refreshJwt);
      if (payload.sub !== input.userId) throw new Error("Mismatch");
      const hashed = hashToken(input.refreshJwt);
      await this.db.refreshToken.deleteMany({
        where: { userId: input.userId, tokenHash: hashed },
      });
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  /** Rotate refresh token (stored as a one-time opaque hash row). */
  async refreshTokens(input: { refreshJwt: string }) {
    let userId = "";
    try {
      ({ sub: userId } = verifyRefresh(input.refreshJwt));
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }

    const hashed = hashToken(input.refreshJwt);
    const existing = await this.db.refreshToken.findUnique({ where: { tokenHash: hashed } });
    if (!existing || existing.userId !== userId) throw new AppError("Invalid refresh token", 401);
    if (existing.revokedAt) throw new AppError("Refresh token revoked", 401);
    if (existing.expiresAt < new Date()) throw new AppError("Refresh token expired", 401);

    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        accountStatus: true,
      },
    });
    if (!user || user.accountStatus !== "ACTIVE") throw new AppError("Unauthorized", 401);

    const newRefresh = signRefreshToken(user.id);
    const nextHash = hashToken(newRefresh);
    const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1000);

    await this.db.$transaction([
      this.db.refreshToken.delete({ where: { id: existing.id } }),
      this.db.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: nextHash,
          expiresAt,
        },
      }),
    ]);

    return {
      accessToken: signAccessToken(user.id, user.role as Role),
      refreshToken: newRefresh,
    };
  }

  async verifyEmail(rawToken: string) {
    const tok = hashToken(rawToken);
    const rec = await this.db.emailVerificationToken.findUnique({
      where: { tokenHash: tok },
    });
    if (!rec || rec.expiresAt < new Date()) throw new AppError("Invalid or expired token", 400);

    await this.db.$transaction([
      this.db.user.update({
        where: { id: rec.userId },
        data: { emailVerified: true },
      }),
      this.db.emailVerificationToken.delete({ where: { userId: rec.userId } }),
    ]);

    return { ok: true as const };
  }

  async requestPasswordReset(email: string) {
    const e = email.trim().toLowerCase();
    const user = await this.db.user.findUnique({
      where: { email: e },
      select: { id: true, email: true },
    });

    if (!user) {
      return { ok: true as const };
    }

    await this.db.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const raw = rawToken();
    const hashed = hashToken(raw);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashed,
        expiresAt,
      },
    });

    const url = `${env.APP_PUBLIC_URL}/reset-password?token=${encodeURIComponent(raw)}`;
    await sendTransactionalEmail({
      to: e,
      subject: "Password reset requested",
      text: `If you requested this, reset here:\n${url}\n\nExpires in 1 hour.`,
    });

    return { ok: true as const };
  }

  async resetPassword(rawToken: string, newPassword: string) {
    const tok = hashToken(rawToken);
    const rec = await this.db.passwordResetToken.findUnique({ where: { tokenHash: tok } });
    if (!rec || rec.expiresAt < new Date()) throw new AppError("Invalid or expired token", 400);

    const passwordHash = await bcrypt.hash(newPassword, bcryptRounds);

    await this.db.$transaction([
      this.db.user.update({
        where: { id: rec.userId },
        data: { passwordHash, failedLoginAttempts: 0, lockoutUntil: null },
      }),
      this.db.passwordResetToken.delete({ where: { userId: rec.userId } }),
      this.db.refreshToken.deleteMany({ where: { userId: rec.userId } }),
    ]);

    return { ok: true as const };
  }

  /**
   * One-time bootstrap: create the first ADMIN when none exist.
   * Disabled automatically after the first admin is created.
   */
  async bootstrapAdmin(input: {
    email: string;
    password: string;
    displayName?: string;
  }) {
    const adminCount = await this.db.user.count({ where: { role: "ADMIN" } });
    if (adminCount > 0) {
      throw new AppError("Admin already bootstrapped", 403);
    }

    const email = input.email.trim().toLowerCase();
    const existing = await this.db.user.findUnique({ where: { email } });
    if (existing) throw new AppError("Email already in use");

    const passwordHash = await bcrypt.hash(input.password, bcryptRounds);
    const displayName = (input.displayName?.trim() || "Admin").slice(0, 120);
    const slug = slugify(displayName, randomBytes(3).toString("hex"));

    const user = await this.db.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "ADMIN",
          emailVerified: true,
          accountStatus: "ACTIVE",
        },
        select: {
          id: true,
          email: true,
          role: true,
          emailVerified: true,
        },
      });

      await tx.profile.create({
        data: {
          userId: created.id,
          displayName,
          slug,
          bio: "Platform administrator",
          city: "HQ",
          active: false,
          availability: "OFFLINE",
        },
      });

      return created;
    });

    const access = signAccessToken(user.id, "ADMIN");
    const refreshJwt = signRefreshToken(user.id);
    const rtHash = hashToken(refreshJwt);
    await this.db.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: rtHash,
        expiresAt: new Date(Date.now() + env.JWT_REFRESH_TTL_SECONDS * 1000),
      },
    });

    return {
      accessToken: access,
      refreshToken: refreshJwt,
      userId: user.id,
      role: user.role as Role,
      emailVerified: true,
    };
  }

  private async touchProfileActivity(userId: string) {
    await this.db.profile.updateMany({
      where: { userId },
      data: { lastActiveAt: new Date() },
    });
  }
}

export const authSvc = new AuthService();

