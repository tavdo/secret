import type { AccountStatus, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { notifications } from "./notification.service.js";

export class AdminService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async listUsers(takeRaw: number, cursor?: string) {
    const take = Math.min(Math.max(takeRaw, 1), 100);

    const rows = await this.db.user.findMany({
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        accountStatus: true,
        emailVerified: true,
        createdAt: true,
        profile: {
          select: {
            slug: true,
            displayName: true,
            city: true,
          },
        },
      },
    });

    const nextCursor = rows.length === take ? rows[rows.length - 1]?.id : undefined;

    return { items: rows, nextCursor };
  }

  async setAccountStatus(userId: string, status: AccountStatus) {
    const u = await this.db.user.update({
      where: { id: userId },
      data: {
        accountStatus: status,
      },
      select: { id: true },
    });

    await notifications.create({
      userId: u.id,
      type: "MODERATION",
      title: "Account status updated",
      body: `Your account status is now ${status}.`,
      meta: { status },
    });

    return u;
  }

  async moderateProfile(
    profileId: string,
    input: {
      verificationStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
      vipBadge?: boolean;
      active?: boolean;
      moderatedNote?: string;
      moderatedByUserId: string;
    }
  ) {
    const existing = await this.db.profile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });
    if (!existing) throw new AppError("Not found", 404);

    await this.db.profile.update({
      where: { id: profileId },
      data: {
        ...(input.verificationStatus ? { verificationStatus: input.verificationStatus } : {}),
        ...(typeof input.vipBadge === "boolean" ? { vipBadge: input.vipBadge } : {}),
        ...(typeof input.active === "boolean" ? { active: input.active } : {}),
        ...(typeof input.moderatedNote === "string"
          ? {
              moderatedNote: input.moderatedNote.trim(),
              moderatedAt: new Date(),
              moderatedByUserId: input.moderatedByUserId,
            }
          : {}),
      },
    });

    await notifications.create({
      userId: existing.userId,
      type: "MODERATION",
      title: "Profile moderated",
      body:
        typeof input.moderatedNote === "string" ? input.moderatedNote.trim() : "Staff updated your listing.",
      meta: { profileId },
    });

    return { ok: true as const };
  }

  async handleReport(
    reportId: string,
    input: {
      status: "IN_REVIEW" | "RESOLVED" | "DISMISSED";
      resolvedNote?: string;
    }
  ) {
    const rpt = await this.db.report.update({
      where: { id: reportId },
      data: {
        status: input.status,
        ...(input.resolvedNote ? { resolvedNote: input.resolvedNote } : {}),
        resolvedAt:
          input.status === "RESOLVED" || input.status === "DISMISSED" ? new Date() : null,
      },
      include: {
        reporter: { select: { id: true } },
      },
    });

    await notifications.create({
      userId: rpt.reporterUserId,
      type: "MODERATION",
      title: "Report updated",
      body:
        typeof input.resolvedNote === "string"
          ? input.resolvedNote
          : `Your report is now marked ${input.status}.`,
      meta: { reportId: rpt.id, status: rpt.status },
    });

    return rpt;
  }

  async createVipSubscription(
    profileId: string,
    input: {
      planName: string;
      months: number;
      externalRef?: string;
    }
  ) {
    const profile = await this.db.profile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });
    if (!profile) throw new AppError("Not found", 404);

    const from = new Date();
    const until = new Date(from);
    until.setMonth(until.getMonth() + input.months);

    const sub = await this.db.$transaction(async (tx) => {
      await tx.profile.update({
        where: { id: profileId },
        data: {
          vipBadge: true,
        },
      });

      const created = await tx.vipSubscription.create({
        data: {
          profileId,
          planName: input.planName,
          validFrom: from,
          validUntil: until,
          externalRef: input.externalRef,
          active: true,
        },
      });

      await tx.notification.create({
        data: {
          userId: profile.userId,
          type: "VIP_SUBSCRIPTION",
          title: "VIP upgraded",
          body: `VIP plan '${input.planName}' is active until ${until.toISOString()}.`,
          meta: {
            profileId,
            validUntil: until.toISOString(),
          },
        },
      });

      return created;
    });

    return sub;
  }

  async analyticsSnapshot() {
    const [users, providers, bookingGroups, unreadReports] = await Promise.all([
      this.db.user.count(),
      this.db.user.count({ where: { role: "PROVIDER" } }),
      this.db.booking.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      this.db.report.count({ where: { status: "OPEN" } }),
    ]);

    return {
      users,
      providers,
      unreadReports,
      bookingsByStatus: bookingGroups.map((row) => ({
        status: row.status,
        count: row._count.status,
      })),
    };
  }

  async listReports(takeRaw: number, status?: string) {
    const take = Math.min(Math.max(takeRaw, 1), 100);
    return this.db.report.findMany({
      where: status ? { status: status as never } : undefined,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        reporter: { select: { id: true, email: true } },
        subject: { select: { id: true, email: true } },
      },
    });
  }

  /** Seed helper for early environments (idempotent-ish). */
  async ensureDefaultCategories(seed: Array<{ name: string; slug: string }>) {
    await Promise.all(
      seed.map((c) =>
        this.db.category.upsert({
          where: { slug: c.slug },
          update: {},
          create: { name: c.name, slug: c.slug },
        })
      )
    );
  }
}

export const adminSvc = new AdminService(prisma);
