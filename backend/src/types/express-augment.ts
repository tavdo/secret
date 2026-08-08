import type { Role } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    auth?: { userId: string; role: Role };
    requestId?: string;
  }
}

export {};
