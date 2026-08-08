import { createBrowserClient } from '@supabase/ssr';

let client;

export function createClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
}

/** Lazy shared browser client — only created when first used. */
export function getSupabase() {
  if (!client) client = createClient();
  return client;
}

export const supabase = {
  get auth() {
    return getSupabase().auth;
  },
  from(...args) {
    return getSupabase().from(...args);
  },
};
