import type { SupabaseClient } from "@supabase/supabase-js";

let sessionPromise: Promise<boolean> | null = null;

/**
 * Ensures the browser has a Supabase anonymous auth session so RLS can scope
 * saved_components to auth.uid(). Each browser/profile gets its own user id.
 */
export async function ensureSaveSession(
  supabase: SupabaseClient
): Promise<boolean> {
  if (sessionPromise) return sessionPromise;

  sessionPromise = (async () => {
    const { data: existing } = await supabase.auth.getSession();
    if (existing.session?.user) return true;

    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("[save-session] anonymous sign-in failed:", error.message);
      sessionPromise = null;
      return false;
    }
    return true;
  })();

  return sessionPromise;
}

/** Call after a failed auth so the next save attempt can retry sign-in. */
export function resetSaveSession(): void {
  sessionPromise = null;
}
