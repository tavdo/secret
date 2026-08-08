import type { AvailabilityStatus, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { configureCloudinary, isCloudinaryConfigured, uploadImageBuffer } from "../integrations/cloudinary.js";
import { randomBytes } from "node:crypto";
import { slugify } from "../utils/slugify.js";

function canSeeVipMedia(viewer: { userId: string; role: string } | null, ownerUserId: string): boolean {
  if (!viewer) return false;
  if (viewer.role === "ADMIN") return true;
  return viewer.userId === ownerUserId;
}

export class ProfileService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async ensureProfileOwnership(userId: string) {
    const p = await this.db.profile.findUnique({ where: { userId } });
    if (!p) throw new AppError("Profile missing");
    return p;
  }

  async getMine(userId: string) {
    const p = await this.db.profile.findUnique({
      where: { userId },
      include: {
        categories: { include: { category: true } },
        galleryItems: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!p) throw new AppError("Profile missing");
    return p;
  }

  async updateMine(
    userId: string,
    patch: {
      displayName?: string;
      bio?: string;
      city?: string;
      availability?: AvailabilityStatus;
      priceMin?: number | null;
      priceMax?: number | null;
      currency?: string | null;
      servicesText?: string | null;
      categoryIds?: string[];
    },
  ) {
    const profile = await this.ensureProfileOwnership(userId);
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { role: true },
    });

    const slug =
      patch.displayName && patch.displayName !== profile.displayName
        ? slugify(patch.displayName, randomBytes(2).toString("hex"))
        : undefined;

    await this.db.profile.update({
      where: { id: profile.id },
      data: {
        displayName: patch.displayName?.trim(),
        slug,
        bio: patch.bio?.trim(),
        city: patch.city?.trim(),
        availability: patch.availability,
        priceMin: patch.priceMin ?? undefined,
        priceMax: patch.priceMax ?? undefined,
        currency: patch.currency ?? undefined,
        servicesText: patch.servicesText ?? undefined,
      },
      include: {
        categories: { include: { category: true } },
        galleryItems: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (patch.categoryIds && user.role === "PROVIDER") {
      await this.db.profileCategory.deleteMany({ where: { profileId: profile.id } });
      await this.db.profileCategory.createMany({
        data: patch.categoryIds.map((categoryId) => ({ profileId: profile.id, categoryId })),
        skipDuplicates: true,
      });
    }

    return this.db.profile.findUniqueOrThrow({
      where: { id: profile.id },
      include: {
        categories: { include: { category: true } },
        galleryItems: { orderBy: { sortOrder: "asc" } },
      },
    });
  }

  async getPublicBySlug(slug: string, viewer: { userId: string; role: string } | null) {
    const p = await this.db.profile.findUnique({
      where: { slug, active: true },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            accountStatus: true,
            emailVerified: true,
          },
        },
        categories: { include: { category: true } },
        galleryItems: { orderBy: { sortOrder: "asc" } },
        _count: { select: { reviews: true, favorites: true } },
      },
    });

    if (!p || p.user.accountStatus !== "ACTIVE") throw new AppError("Not found", 404);

    const ownerId = p.userId;
    const gallery = p.galleryItems.map((g) => {
      const locked = g.vipLocked && !canSeeVipMedia(viewer, ownerId);
      if (locked) {
        return { id: g.id, vipLocked: true as const };
      }
      return {
        id: g.id,
        url: g.url,
        vipLocked: false as const,
        sortOrder: g.sortOrder,
        mimeType: g.mimeType,
        createdAt: g.createdAt,
      };
    });

    return {
      id: p.id,
      slug: p.slug,
      displayName: p.displayName,
      bio: p.bio,
      city: p.city,
      age: p.age,
      avatarUrl: p.avatarUrl,
      verificationStatus: p.verificationStatus,
      vipBadge: p.vipBadge,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      priceMin: p.priceMin,
      priceMax: p.priceMax,
      currency: p.currency,
      servicesText: p.servicesText,
      availability: p.availability,
      lastActiveAt: p.lastActiveAt,
      categories: p.categories.map((pc) => pc.category),
      galleryItems: gallery,
      counts: p._count,
      role: p.user.role,
    };
  }

  async appendGalleryFromUpload(opts: {
    userId: string;
    vipLocked?: boolean;
    buffer: Buffer;
    mimetype: string;
    originalName: string;
  }) {
    if (!isCloudinaryConfigured()) {
      throw new AppError(
        "File uploads disabled (configure CLOUDINARY_* environment variables)",
        503,
        "CLOUDINARY_NOT_CONFIGURED"
      );
    }
    configureCloudinary();

    const profile = await this.ensureProfileOwnership(opts.userId);
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: opts.userId },
      select: { role: true },
    });
    if (user.role !== "PROVIDER") throw new AppError("Only provider accounts can publish gallery media", 403);

    const publicIdBase = slugify(profile.slug, randomBytes(2).toString("hex")).slice(0, 48);
    const uploaded = await uploadImageBuffer(`profiles/${profile.id}`, opts.buffer, publicIdBase);

    const highest = await this.db.galleryItem.aggregate({
      where: { profileId: profile.id },
      _max: { sortOrder: true },
    });

    const item = await this.db.galleryItem.create({
      data: {
        profileId: profile.id,
        url: uploaded.url,
        publicId: uploaded.publicId,
        vipLocked: Boolean(opts.vipLocked),
        sortOrder: (highest._max.sortOrder ?? 0) + 1,
        mimeType: opts.mimetype,
        bytes: opts.buffer.length,
      },
    });

    return item;
  }

  async setAvatarFromUpload(opts: { userId: string; buffer: Buffer; originalName: string; mimetype: string }) {
    if (!isCloudinaryConfigured()) {
      throw new AppError(
        "File uploads disabled (configure CLOUDINARY_* environment variables)",
        503,
        "CLOUDINARY_NOT_CONFIGURED"
      );
    }
    configureCloudinary();

    const profile = await this.ensureProfileOwnership(opts.userId);
    const uploaded = await uploadImageBuffer(`avatars/${profile.id}`, opts.buffer, `avatar-${randomBytes(2).toString("hex")}`);

    return this.db.profile.update({
      where: { id: profile.id },
      data: { avatarUrl: uploaded.url, avatarPublicId: uploaded.publicId },
    });
  }

  async toggleFavorite(viewerUserId: string, profileSlug: string) {
    const p = await this.db.profile.findUnique({ where: { slug: profileSlug }, select: { id: true } });
    if (!p) throw new AppError("Not found", 404);

    const existing = await this.db.favorite.findUnique({
      where: { userId_profileId: { userId: viewerUserId, profileId: p.id } },
    });

    if (existing) {
      await this.db.favorite.delete({ where: { id: existing.id } });
      return { favorited: false as const };
    }

    await this.db.favorite.create({ data: { userId: viewerUserId, profileId: p.id } });
    return { favorited: true as const };
  }

  async listMineFavorites(userId: string) {
    const fav = await this.db.favorite.findMany({
      where: { userId },
      include: { profile: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return fav.map((f) => f.profile);
  }
}

export const profiles = new ProfileService(prisma);
