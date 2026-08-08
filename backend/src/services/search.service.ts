import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export class SearchService {
  async discovery(input: {
    city?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    vipOnly?: boolean;
    featuredOnly?: boolean;
    sort?: "trending" | "recent" | "rating";
    take: number;
    cursor?: Date;
  }) {
    const where: Prisma.ProfileWhereInput = {
      active: true,
      user: {
        accountStatus: "ACTIVE",
        role: "PROVIDER",
      },
      ...(input.city ? { city: { equals: input.city, mode: "insensitive" } } : {}),
      ...(input.vipOnly ? { vipBadge: true } : {}),
      ...(input.featuredOnly ? { featured: true } : {}),
      ...(input.categorySlug
        ? {
            categories: {
              some: { category: { slug: input.categorySlug } },
            },
          }
        : {}),
      ...(input.minPrice != null || input.maxPrice != null
        ? {
            AND: [
              ...(input.minPrice != null ? [{ priceMax: { gte: input.minPrice } }] : []),
              ...(input.maxPrice != null ? [{ priceMin: { lte: input.maxPrice } }] : []),
            ],
          }
        : {}),
      ...(input.cursor ? { lastActiveAt: { lt: input.cursor } } : {}),
    };

    let orderBy: Prisma.ProfileOrderByWithRelationInput[] = [{ lastActiveAt: "desc" }];

    if (input.sort === "trending") orderBy = [{ featured: "desc" }, { avgRating: "desc" }, { reviewCount: "desc" }];
    if (input.sort === "rating") orderBy = [{ avgRating: "desc" }];
    if (input.sort === "recent") orderBy = [{ lastActiveAt: "desc" }];

    const rows = await prisma.profile.findMany({
      where,
      select: {
        id: true,
        slug: true,
        displayName: true,
        bio: true,
        city: true,
        age: true,
        avatarUrl: true,
        verificationStatus: true,
        vipBadge: true,
        featured: true,
        availability: true,
        avgRating: true,
        reviewCount: true,
        priceMin: true,
        priceMax: true,
        currency: true,
        servicesText: true,
        lastActiveAt: true,
        galleryItems: {
          select: { url: true },
          orderBy: { sortOrder: "asc" },
          take: 3,
        },
      },
      orderBy,
      take: input.take + 1,
    });

    const nextCursor = rows.length > input.take ? rows[input.take]?.lastActiveAt ?? null : null;
    const page = rows.length > input.take ? rows.slice(0, input.take) : rows;

    return {
      items: page.map((p) => ({
        id: p.id,
        slug: p.slug,
        displayName: p.displayName,
        bio: p.bio,
        city: p.city,
        age: p.age,
        avatarUrl: p.avatarUrl,
        verificationStatus: p.verificationStatus,
        vipBadge: p.vipBadge,
        featured: p.featured,
        availability: p.availability,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        priceMin: p.priceMin,
        priceMax: p.priceMax,
        currency: p.currency,
        servicesText: p.servicesText,
        lastActiveAt: p.lastActiveAt,
        galleryUrls: p.galleryItems.map((g) => g.url),
      })),
      nextCursor,
    };
  }
}

export const search = new SearchService();
