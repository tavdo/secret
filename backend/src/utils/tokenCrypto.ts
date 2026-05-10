import { createHash, randomBytes } from "node:crypto";

export function rawToken(lengthBytes = 32): string {
  return randomBytes(lengthBytes).toString("hex");
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
