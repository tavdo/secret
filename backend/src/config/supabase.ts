import {
  createAdminClient,
  createContextClient,
  verifyAuth,
} from "@supabase/server/core";
import type { Request } from "express";

/**
 * Admin client (bypasses RLS). Requires SUPABASE_SECRET_KEY in env.
 */
export function getSupabaseAdmin() {
  return createAdminClient();
}

/**
 * User-scoped client. Pass the caller's access token so RLS applies.
 */
export function getSupabaseForUser(accessToken: string) {
  return createContextClient({ auth: { token: accessToken } });
}

/**
 * Anon / publishable client (RLS as anon).
 */
export function getSupabaseAnon() {
  return createContextClient();
}

/**
 * Verify a Bearer token on an Express request via Supabase JWKS.
 */
export async function verifySupabaseRequest(
  req: Request
): Promise<{ data: unknown; error: unknown }> {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(","));
  }
  const request = new Request(`http://localhost${req.originalUrl}`, {
    method: req.method,
    headers,
  });
  return verifyAuth(request, { auth: "user" }) as Promise<{
    data: unknown;
    error: unknown;
  }>;
}
