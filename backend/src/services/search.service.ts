import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export class SearchService {
  async discovery(input: {
    city?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
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

    if (input.sort === "trending") orderBy = [{ avgRating: "desc" }, { reviewCount: "desc" }];
    if (input.sort === "rating") orderBy = [{ avgRating: "desc" }];
    if (input.sort === "recent") orderBy = [{ lastActiveAt: "desc" }];

    const rows = await prisma.profile.findMany({
      where,
      select: {
        id: true,
        slug: true,
        displayName: true,
        city: true,
        avatarUrl: true,
        verificationStatus: true,
        vipBadge: true,
        avgRating: true,
        reviewCount: true,
        priceMin: true,
        priceMax: true,
        currency: true,
        lastActiveAt: true,
      },
      orderBy,
      take: input.take + 1,
    });

    const nextCursor = rows.length > input.take ? rows[input.take]?.lastActiveAt ?? null : null;
    const page = rows.length > input.take ? rows.slice(0, input.take) : rows;

    return { items: page, nextCursor };
  }
}

export const search = new SearchService();
