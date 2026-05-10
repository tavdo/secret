import type { PrismaClient } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { orderedParticipants } from "./auth.service.js";
import { notifications } from "./notification.service.js";
import type { Server as IOServer } from "socket.io";

let ioRef: IOServer | null = null;

export function attachMessagingIo(io: IOServer) {
  ioRef = io;
}

export class MessagingService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async getOrCreateRoom(aUserId: string, bUserId: string) {
    const [ua, ub] = orderedParticipants(aUserId, bUserId);

    const existing = await this.db.chatRoom.findUnique({
      where: { userAId_userBId: { userAId: ua, userBId: ub } },
    });

    if (existing) return existing;

    try {
      return await this.db.chatRoom.create({
        data: {
          userAId: ua,
          userBId: ub,
        },
      });
    } catch {
      return this.db.chatRoom.findUniqueOrThrow({
        where: { userAId_userBId: { userAId: ua, userBId: ub } },
      });
    }
  }

  async listRooms(userId: string, take: number, cursor?: Date) {
    const rooms = await this.db.chatRoom.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
        ...(cursor ? { lastMessageAt: { lt: cursor } } : {}),
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
      take: take + 1,
    });

    const nextCursor = rooms.length > take ? rooms[take]?.lastMessageAt ?? null : null;
    const page = rooms.length > take ? rooms.slice(0, take) : rooms;
    return { items: page, nextCursor };
  }

  async listMessages(roomId: string, userId: string, take: number, cursor?: Date) {
    await this.ensureMember(roomId, userId);

    const rows = await this.db.message.findMany({
      where: {
        roomId,
        ...(cursor ? { createdAt: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: take + 1,
    });

    const nextCursor = rows.length > take ? rows[take]?.createdAt ?? null : null;
    const page = rows.length > take ? rows.slice(0, take) : rows;

    return { items: page, nextCursor };
  }

  async sendMessage(roomId: string, senderId: string, body: string, mediaUrl?: string | null) {
    await this.ensureMember(roomId, senderId);

    const msg = await this.db.message.create({
      data: {
        roomId,
        senderId,
        body: body.trim(),
        mediaUrl: mediaUrl ?? undefined,
      },
    });

    await this.db.chatRoom.update({
      where: { id: roomId },
      data: { lastMessageAt: msg.createdAt },
    });

    const room = await this.db.chatRoom.findUniqueOrThrow({ where: { id: roomId } });
    const recipientId = room.userAId === senderId ? room.userBId : room.userAId;

    await notifications.create({
      userId: recipientId,
      type: "MESSAGE_RECEIVED",
      title: "New message",
      body: body.trim().slice(0, 200),
      meta: { roomId, messageId: msg.id },
    });

    ioRef?.to(`room:${roomId}`).emit("chat:message", {
      id: msg.id,
      roomId,
      senderId,
      body: msg.body,
      mediaUrl: msg.mediaUrl,
      createdAt: msg.createdAt,
    });

    return msg;
  }

  /** Marks messages from the other participant as seen (optional upTo boundary). */
  async markSeen(roomId: string, viewerId: string, upToMessageId?: string) {
    await this.ensureMember(roomId, viewerId);

    const upto = upToMessageId
      ? await this.db.message.findUnique({ where: { id: upToMessageId }, select: { createdAt: true } })
      : null;

    const now = new Date();

    await this.db.message.updateMany({
      where: {
        roomId,
        senderId: { not: viewerId },
        ...(upto?.createdAt ? { createdAt: { lte: upto.createdAt } } : {}),
        seenAt: null,
      },
      data: { seenAt: now },
    });

    ioRef?.to(`room:${roomId}`).emit("chat:read", {
      roomId,
      viewerId,
      seenAt: now,
    });

    return { ok: true as const, seenAt: now };
  }

  private async ensureMember(roomId: string, userId: string) {
    const room = await this.db.chatRoom.findUnique({ where: { id: roomId } });
    if (!room || (room.userAId !== userId && room.userBId !== userId)) throw new AppError("Forbidden", 403);
    return room;
  }
}

export const messagingSvc = new MessagingService(prisma);
