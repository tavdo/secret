import dotenv from "dotenv";

dotenv.config();

function get(name: string, fallback?: string): string {
  const v = process.env[name];
  if (v !== undefined && v !== "") return v;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing env var ${name}`);
}

const isDev = (process.env.NODE_ENV ?? "development") !== "production";

const databaseUrlFallback = isDev
  ? "postgresql://postgres:postgres@localhost:5432/marketplace?schema=public"
  : "";

const databaseUrl =
  process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== ""
    ? process.env.DATABASE_URL
    : databaseUrlFallback;

if (!isDev && (!databaseUrl || /localhost|127\.0\.0\.1/.test(databaseUrl))) {
  throw new Error("DATABASE_URL must be a remote Postgres URL in production");
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL: databaseUrl,
  JWT_ISSUER: process.env.JWT_ISSUER ?? "marketplace-api",
  JWT_SECRET: isDev
    ? get("JWT_SECRET", "dev-access-secret-change-me-in-.env")
    : get("JWT_SECRET"),
  JWT_REFRESH_SECRET: isDev
    ? get("JWT_REFRESH_SECRET", "dev-refresh-secret-change-me-in-.env")
    : get("JWT_REFRESH_SECRET"),
  JWT_ACCESS_TTL_SECONDS:
    typeof process.env.JWT_ACCESS_TTL_SECONDS === "string"
      ? Number(process.env.JWT_ACCESS_TTL_SECONDS)
      : 900,
  JWT_REFRESH_TTL_SECONDS:
    typeof process.env.JWT_REFRESH_TTL_SECONDS === "string"
      ? Number(process.env.JWT_REFRESH_TTL_SECONDS)
      : 60 * 60 * 24 * 14,
  CORS_ORIGIN:
    process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean) ?? [
      "http://localhost:5173",
      "http://localhost:4000",
      "https://secret-swart-chi.vercel.app",
    ],
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM ?? "noreply@localhost",
  APP_PUBLIC_URL:
    process.env.APP_PUBLIC_URL ??
    (isDev ? "http://localhost:5173" : "https://secret-swart-chi.vercel.app"),
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",
};
