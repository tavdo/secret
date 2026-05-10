import type { Socket } from "socket.io";
import type { Role } from "@prisma/client";
import type { Server } from "socket.io";
import { verifyAccess } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { attachMessagingIo, messagingSvc } from "../services/messaging.service.js";

async function handshakeAuth(socket: Socket): Promise<void> {
  const tokenRaw = (socket.handshake.auth as { token?: string | undefined }).token;

  const token =
    typeof tokenRaw === "string"
      ? tokenRaw
      : typeof socket.handshake.query.token === "string"
        ? socket.handshake.query.token
        : "";

  if (!token) throw new AppError("Unauthorized", 401);

  const payload = verifyAccess(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, role: true, accountStatus: true },
  });

  if (!user || user.accountStatus !== "ACTIVE") throw new AppError("Unauthorized", 401);

  socket.data.auth = { userId: user.id, role: user.role as Role };

  await prisma.profile.updateMany({
    where: { userId: user.id },
    data: {
      lastActiveAt: new Date(),
    },
  });
}

/** Register Socket.IO handlers for realtime chat + typing/read signals. */
export function registerChatSockets(io: Server) {
  attachMessagingIo(io);

  io.use(async (socket, next) => {
    try {
      await handshakeAuth(socket);
      next();
    } catch (_e: unknown) {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const auth = socket.data.auth as { userId: string; role: Role };

    socket.on("join_room", async (payload: unknown, cb?: (payload: unknown) => void) => {
      try {
        const roomId = typeof payload === "object" && payload && "roomId" in payload ? String(payload.roomId) : "";
        if (!roomId) throw new Error("roomId_required");

        const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
        if (!room || (room.userAId !== auth.userId && room.userBId !== auth.userId)) {
          throw new Error("forbidden");
        }

        await socket.join(`room:${roomId}`);
        cb?.({ ok: true });
      } catch (err) {
        cb?.({ ok: false, error: err instanceof Error ? err.message : "error" });
      }
    });

    socket.on(
      "send_message",
      async (payload: { roomId?: string; body?: string; mediaUrl?: string }, cb?: (payload: unknown) => void) => {
        try {
          if (!payload?.roomId || !payload.body) throw new Error("payload_invalid");
          const msg = await messagingSvc.sendMessage(payload.roomId, auth.userId, payload.body, payload.mediaUrl ?? null);

          cb?.({
            ok: true,
            message: msg,
          });
        } catch (err) {
          cb?.({ ok: false, error: err instanceof Error ? err.message : "error" });
        }
      }
    );

    socket.on(
      "mark_read",
      async (payload: { roomId?: string; upToMessageId?: string }, cb?: (payload: unknown) => void) => {
        try {
          if (!payload?.roomId) throw new Error("roomId_required");
          const seen = await messagingSvc.markSeen(payload.roomId, auth.userId, payload.upToMessageId);
          cb?.(seen);
        } catch (err) {
          cb?.({ ok: false, error: err instanceof Error ? err.message : "error" });
        }
      }
    );

    socket.on("typing:start", ({ roomId }: { roomId?: string }) => {
      if (!roomId) return;
      socket.to(`room:${roomId}`).emit("chat:typing", {
        roomId,
        userId: auth.userId,
        typing: true,
      });
    });

    socket.on("typing:stop", ({ roomId }: { roomId?: string }) => {
      if (!roomId) return;
      socket.to(`room:${roomId}`).emit("chat:typing", {
        roomId,
        userId: auth.userId,
        typing: false,
      });
    });
  });
}
