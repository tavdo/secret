import { PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export class ReviewService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async create(input: {
    reviewerUserId: string;
    bookingId: string;
    rating: number;
    comment?: string;
  }) {
    if (input.rating < 1 || input.rating > 5 || !Number.isInteger(input.rating)) {
      throw new AppError("Rating must be 1–5 integer");
    }

    const booking = await this.db.booking.findUnique({
      where: { id: input.bookingId },
      include: {
        reviews: true,
      },
    });

    if (!booking || booking.clientId !== input.reviewerUserId) throw new AppError("Forbidden", 403);
    if (booking.status !== "COMPLETED") throw new AppError("Booking must be COMPLETED");

    const profile = await this.db.profile.findUnique({
      where: { userId: booking.providerId },
      select: { id: true },
    });
    if (!profile || booking.reviews.length) throw new AppError("Invalid review creation");

    const review = await this.db.$transaction(async (tx) => {
      const r = await tx.review.create({
        data: {
          bookingId: booking.id,
          reviewerId: booking.clientId,
          profileId: profile.id,
          rating: input.rating,
          comment: input.comment?.trim(),
        },
      });

      const agg = await tx.review.aggregate({
        where: { profileId: profile.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.profile.update({
        where: { id: profile.id },
        data: {
          avgRating: agg._avg.rating ?? 0,
          reviewCount: agg._count.rating,
        },
      });

      return r;
    });

    return review;
  }

  async listForProfile(profileSlug: string, take: number, cursor?: Date) {
    const p = await this.db.profile.findUnique({ where: { slug: profileSlug }, select: { id: true } });
    if (!p) throw new AppError("Not found", 404);

    const rows = await this.db.review.findMany({
      where: {
        profileId: p.id,
        ...(cursor ? { createdAt: { lt: cursor } } : {}),
      },
      include: {
        reviewer: {
          select: {
            profile: {
              select: {
                slug: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: take + 1,
    });

    const nextCursor = rows.length > take ? rows[take]?.createdAt ?? null : null;
    const page = rows.length > take ? rows.slice(0, take) : rows;

    return { items: page, nextCursor };
  }
}

export const reviewsSvc = new ReviewService(prisma);
