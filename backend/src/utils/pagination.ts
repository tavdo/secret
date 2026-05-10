/** Cursor pagination (good for infinite scroll). */
export function decodeCursor(cursor?: string | null): Date | undefined {
  if (!cursor) return undefined;
  const t = Buffer.from(cursor, "base64url").toString("utf8");
  const ms = Number(t);
  if (!Number.isFinite(ms)) return undefined;
  return new Date(ms);
}

export function encodeCursor(d: Date): string {
  return Buffer.from(String(d.getTime()), "utf8").toString("base64url");
}

export function clampTake(takeRaw: unknown, max = 50, fallback = 20): number {
  const n = typeof takeRaw === "string" ? Number(takeRaw) : typeof takeRaw === "number" ? takeRaw : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(max, Math.floor(n)));
}
