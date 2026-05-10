import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { Server } from "socket.io";
import { registerChatSockets } from "./socket/chat.js";

const app = createApp();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
});

async function bootstrap() {
  registerChatSockets(io);

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on :${env.PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect().catch(() => undefined);
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
