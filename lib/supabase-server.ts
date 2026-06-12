import { createClient } from "@supabase/supabase-js";

/** Server-side Supabase client for API routes (uses anon key + RLS). */
export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key);
}
