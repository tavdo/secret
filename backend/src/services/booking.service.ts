import type { BookingStatus, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { notifications } from "./notification.service.js";

export class BookingService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async createRequest(input: {
    clientUserId: string;
    providerUserId: string;
    startsAt: Date;
    endsAt: Date;
    note?: string;
  }) {
    if (input.clientUserId === input.providerUserId) {
      throw new AppError("Invalid booking participant");
    }

    const provider = await this.db.user.findUnique({
      where: { id: input.providerUserId },
      select: { id: true, role: true, accountStatus: true },
    });

    if (!provider || provider.role !== "PROVIDER" || provider.accountStatus !== "ACTIVE") {
      throw new AppError("Invalid provider");
    }

    if (input.endsAt <= input.startsAt) throw new AppError("endsAt must be after startsAt");

    const booking = await this.db.booking.create({
      data: {
        clientId: input.clientUserId,
        providerId: input.providerUserId,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        note: input.note?.trim(),
        status: "PENDING",
      },
    });

    await notifications.create({
      userId: input.providerUserId,
      type: "BOOKING_CREATED",
      title: "New booking request",
      body: "You have a new booking request.",
      bookingId: booking.id,
      meta: {
        bookingId: booking.id,
        clientUserId: input.clientUserId,
      },
    });

    return booking;
  }

  async setStatus(actorUserId: string, bookingId: string, status: BookingStatus, note?: string) {
    const b = await this.db.booking.findUnique({ where: { id: bookingId } });
    if (!b) throw new AppError("Not found", 404);

    const isClient = actorUserId === b.clientId;
    const isProvider = actorUserId === b.providerId;
    const admin = await this.db.user.findUnique({
      where: { id: actorUserId },
      select: { role: true },
    });

    const isAdmin = admin?.role === "ADMIN";

    if (
      ["ACCEPTED", "REJECTED"].includes(status) &&
      !(isProvider || isAdmin)
    ) {
      throw new AppError("Forbidden", 403);
    }

    if (
      ["CANCELLED"].includes(status) &&
      !(isClient || isProvider || isAdmin)
    ) {
      throw new AppError("Forbidden", 403);
    }

    if (status === "COMPLETED" && !(isProvider || isAdmin)) {
      throw new AppError("Forbidden", 403);
    }

    const updated = await this.db.booking.update({
      where: { id: bookingId },
      data: {
        status,
        note: typeof note === "string" ? note.trim() || b.note || undefined : b.note,
      },
    });

    const targets = [...new Set([b.clientId, b.providerId])];

    await Promise.all(
      targets.map((uid) =>
        notifications.create({
          userId: uid,
          type: "BOOKING_UPDATED",
          title: "Booking updated",
          body: uid === actorUserId ? "Your booking changed status." : "A booking you're on was updated.",
          bookingId: updated.id,
          meta: {
            status: updated.status,
          },
        })
      )
    );

    return updated;
  }

  async listForUser(userId: string, take: number, cursor?: Date, roleSide?: "client" | "provider") {
    const paging = cursor ? { createdAt: { lt: cursor } as const } : {};

    let where;

    if (roleSide === "provider") where = { providerId: userId, ...paging };
    else if (roleSide === "client") where = { clientId: userId, ...paging };
    else where = { OR: [{ clientId: userId }, { providerId: userId }], ...paging };

    const rows = await this.db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: take + 1,
    });

    const nextCursor = rows.length > take ? rows[take]?.createdAt ?? null : null;
    const page = rows.length > take ? rows.slice(0, take) : rows;

    return { items: page, nextCursor };
  }

  async getForUser(bookingId: string, userId: string) {
    const admin =
      (
        await this.db.user.findUnique({
          where: { id: userId },
          select: { role: true },
        })
      )?.role === "ADMIN";

    const row = await this.db.booking.findFirst({
      where: admin
        ? { id: bookingId }
        : {
            id: bookingId,
            OR: [{ clientId: userId }, { providerId: userId }],
          },
    });

    if (!row) throw new AppError("Not found", 404);
    return row;
  }
}

export const bookings = new BookingService(prisma);
