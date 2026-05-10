import type { BookingStatus, NotificationType, PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma.js";

type CreateInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  meta?: Record<string, unknown>;
  bookingId?: string;
};

export function notificationCopyForBookingStatus(status: BookingStatus): {
  title: string;
  body: string;
} {
  switch (status) {
    case "PENDING":
      return { title: "New booking request", body: "You have a booking request awaiting your decision." };
    case "ACCEPTED":
      return { title: "Booking accepted", body: "A booking request was accepted." };
    case "REJECTED":
      return { title: "Booking rejected", body: "A booking request was rejected." };
    case "CANCELLED":
      return { title: "Booking cancelled", body: "A booking was cancelled." };
    case "COMPLETED":
      return { title: "Booking completed", body: "A booking was marked completed." };
    default:
      return { title: "Booking update", body: "A booking was updated." };
  }
}

export class NotificationService {
  constructor(private readonly db: PrismaClient) {}

  async create(input: CreateInput) {
    return this.db.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        meta: input.meta as object | undefined,
        bookingId: input.bookingId,
      },
    });
  }

  async listMine(userId: string, unreadOnly: boolean, take: number, cursor?: Date) {
    return this.db.notification.findMany({
      where: {
        userId,
        readAt: unreadOnly ? null : undefined,
        ...(cursor ? { createdAt: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: take + 1,
    });
  }

  async markRead(userId: string, id: string) {
    const n = await this.db.notification.findFirst({ where: { id, userId } });
    if (!n) return null;
    return this.db.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }
}

export const notifications = new NotificationService(prisma);
