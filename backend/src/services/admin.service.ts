import type { AccountStatus, AvailabilityStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { notifications } from "./notification.service.js";
import { slugify } from "../utils/slugify.js";

type AdminProfileInput = {
  displayName: string;
  handle?: string;
  email?: string;
  password?: string;
  age?: number | null;
  city: string;
  bio?: string;
  hourlyRate?: number | null;
  vip?: boolean;
  available?: boolean;
  hidden?: boolean;
  featured?: boolean;
  avatar?: string | null;
  gallery?: string[];
};

function normalizeHandle(raw: string | undefined, displayName: string) {
  const base = (raw?.trim() || displayName)
    .replace(/^@+/, "")
    .trim();
  return slugify(base || "profile");
}

function publicIdForUrl(url: string) {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 16);
  return `admin-url-${hash}`;
}

function toAdminProfileDto(row: {
  id: string;
  displayName: string;
  slug: string;
  bio: string;
  city: string;
  age: number | null;
  avatarUrl: string | null;
  vipBadge: boolean;
  featured: boolean;
  priceMin: number | null;
  priceMax: number | null;
  availability: AvailabilityStatus;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: { email: string; role: string };
  galleryItems: Array<{ url: string; sortOrder: number }>;
}) {
  const rate = row.priceMin ?? row.priceMax ?? 0;
  return {
    id: row.id,
    userId: row.userId,
    email: row.user.email,
    role: row.user.role,
    displayName: row.displayName,
    handle: `@${row.slug}`,
    slug: row.slug,
    age: row.age ?? 25,
    city: row.city,
    bio: row.bio,
    hourlyRate: rate,
    vip: row.vipBadge,
    available: row.availability === "AVAILABLE",
    hidden: !row.active,
    featured: row.featured,
    avatar: row.avatarUrl ?? "",
    gallery: [...row.galleryItems]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((g) => g.url),
    createdAt: row.createdAt.toISOString().slice(0, 10),
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
  };
}

const profileInclude = {
  user: { select: { email: true, role: true } },
  galleryItems: {
    select: { url: true, sortOrder: true },
    orderBy: { sortOrder: "asc" as const },
  },
};

export class AdminService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async listProfiles(takeRaw: number, cursor?: string, q?: string) {
    const take = Math.min(Math.max(takeRaw, 1), 200);
    const query = q?.trim();

    const rows = await this.db.profile.findMany({
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take,
      orderBy: { createdAt: "desc" },
      where: {
        user: { role: { not: "ADMIN" } },
        ...(query
          ? {
              OR: [
                { displayName: { contains: query, mode: "insensitive" } },
                { slug: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { user: { email: { contains: query, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: profileInclude,
    });

    const nextCursor = rows.length === take ? rows[rows.length - 1]?.id : undefined;
    return {
      items: rows.map((r) => toAdminProfileDto(r)),
      nextCursor,
    };
  }

  async getProfile(profileId: string) {
    const row = await this.db.profile.findUnique({
      where: { id: profileId },
      include: profileInclude,
    });
    if (!row) throw new AppError("Not found", 404);
    return toAdminProfileDto(row);
  }

  async createProfile(input: AdminProfileInput) {
    const displayName = input.displayName.trim();
    if (displayName.length < 2) throw new AppError("Display name required", 400);

    const city = (input.city || "Batumi").trim() || "Batumi";
    const bio = (input.bio?.trim() || "").slice(0, 20000);
    const email =
      input.email?.trim().toLowerCase() ||
      `provider-${randomBytes(4).toString("hex")}@marketplace.local`;
    const password = input.password?.trim() || `Temp-${randomBytes(6).toString("hex")}!a1`;

    const existing = await this.db.user.findUnique({ where: { email } });
    if (existing) throw new AppError("Email already in use", 409);

    let slug = normalizeHandle(input.handle, displayName);
    const slugTaken = await this.db.profile.findUnique({ where: { slug } });
    if (slugTaken) slug = slugify(slug, randomBytes(2).toString("hex"));

    const rate =
      typeof input.hourlyRate === "number" && Number.isFinite(input.hourlyRate)
        ? Math.max(0, Math.round(input.hourlyRate))
        : null;
    const age =
      typeof input.age === "number" && Number.isFinite(input.age)
        ? Math.min(120, Math.max(18, Math.round(input.age)))
        : null;

    const passwordHash = await bcrypt.hash(password, 12);
    const gallery = Array.isArray(input.gallery)
      ? input.gallery.map((u) => String(u).trim()).filter(Boolean)
      : [];
    const avatar = input.avatar?.trim() || gallery[0] || null;

    const created = await this.db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "PROVIDER",
          emailVerified: true,
          accountStatus: "ACTIVE",
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          displayName,
          slug,
          bio,
          city,
          age,
          avatarUrl: avatar,
          vipBadge: Boolean(input.vip),
          featured: Boolean(input.featured),
          active: input.hidden !== true,
          availability: input.available === false ? "OFFLINE" : "AVAILABLE",
          priceMin: rate,
          priceMax: rate,
          currency: "USD",
          galleryItems: {
            create: gallery.map((url, sortOrder) => ({
              url,
              publicId: publicIdForUrl(url),
              vipLocked: false,
              sortOrder,
              mimeType: "image/jpeg",
              bytes: 0,
            })),
          },
        },
        include: profileInclude,
      });

      return profile;
    });

    return toAdminProfileDto(created);
  }

  async updateProfile(profileId: string, input: Partial<AdminProfileInput>) {
    const existing = await this.db.profile.findUnique({
      where: { id: profileId },
      select: { id: true, slug: true },
    });
    if (!existing) throw new AppError("Not found", 404);

    const data: Record<string, unknown> = {};

    if (typeof input.displayName === "string") {
      const displayName = input.displayName.trim();
      if (displayName.length < 2) throw new AppError("Display name required", 400);
      data.displayName = displayName;
    }
    if (typeof input.city === "string") data.city = input.city.trim() || "Batumi";
    if (typeof input.bio === "string") data.bio = input.bio.trim().slice(0, 20000);
    if (typeof input.vip === "boolean") data.vipBadge = input.vip;
    if (typeof input.featured === "boolean") data.featured = input.featured;
    if (typeof input.hidden === "boolean") data.active = !input.hidden;
    if (typeof input.available === "boolean") {
      data.availability = input.available ? "AVAILABLE" : "OFFLINE";
    }
    if (typeof input.avatar === "string") {
      data.avatarUrl = input.avatar.trim() || null;
    }
    if (typeof input.hourlyRate === "number" && Number.isFinite(input.hourlyRate)) {
      const rate = Math.max(0, Math.round(input.hourlyRate));
      data.priceMin = rate;
      data.priceMax = rate;
    }
    if (input.age === null) data.age = null;
    else if (typeof input.age === "number" && Number.isFinite(input.age)) {
      data.age = Math.min(120, Math.max(18, Math.round(input.age)));
    }

    if (typeof input.handle === "string" && input.handle.trim()) {
      let slug = normalizeHandle(input.handle, String(data.displayName || existing.slug));
      if (slug !== existing.slug) {
        const taken = await this.db.profile.findFirst({
          where: { slug, NOT: { id: profileId } },
          select: { id: true },
        });
        if (taken) slug = slugify(slug, randomBytes(2).toString("hex"));
        data.slug = slug;
      }
    }

    const updated = await this.db.$transaction(async (tx) => {
      if (Array.isArray(input.gallery)) {
        const gallery = input.gallery.map((u) => String(u).trim()).filter(Boolean);
        await tx.galleryItem.deleteMany({ where: { profileId } });
        if (gallery.length) {
          await tx.galleryItem.createMany({
            data: gallery.map((url, sortOrder) => ({
              profileId,
              url,
              publicId: publicIdForUrl(url),
              vipLocked: false,
              sortOrder,
              mimeType: "image/jpeg",
              bytes: 0,
            })),
          });
        }
        if (!("avatarUrl" in data) && gallery[0]) {
          data.avatarUrl = gallery[0];
        }
      }

      return tx.profile.update({
        where: { id: profileId },
        data,
        include: profileInclude,
      });
    });

    return toAdminProfileDto(updated);
  }

  async deleteProfile(profileId: string) {
    const existing = await this.db.profile.findUnique({
      where: { id: profileId },
      select: { userId: true, user: { select: { role: true } } },
    });
    if (!existing) throw new AppError("Not found", 404);
    if (existing.user.role === "ADMIN") {
      throw new AppError("Cannot delete an admin account via profiles", 400);
    }

    // Cascades profile + gallery via User relation
    await this.db.user.delete({ where: { id: existing.userId } });
    return { ok: true as const };
  }

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
