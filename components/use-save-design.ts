"use client";

import * as React from "react";

import { getSupabase, type ToolId } from "@/lib/supabase";
import { ensureSaveSession, resetSaveSession } from "@/lib/save-session";

type SavePayload = {
  name: string;
  classString: string;
  config: Record<string, unknown>;
};

/**
 * Encapsulates the "Save Design" insert flow for a given tool. Returns a
 * `reloadSignal` that the matching <SavedDesigns> grid can watch to refetch.
 */
export function useSaveDesign(
  tool: ToolId,
  showToast: (msg: string, ok?: boolean) => void
) {
  const [saving, setSaving] = React.useState(false);
  const [reloadSignal, setReloadSignal] = React.useState(0);

  const save = React.useCallback(
    async ({ name, classString, config }: SavePayload) => {
      const supabase = getSupabase();
      if (!supabase) {
        showToast("Connect Supabase to save designs", false);
        return;
      }
      setSaving(true);
      const authed = await ensureSaveSession(supabase);
      if (!authed) {
        setSaving(false);
        showToast("Couldn't start a private save session", false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSaving(false);
        showToast("Couldn't verify your save session", false);
        return;
      }
      const { error } = await supabase.from("saved_components").insert({
        name: name.trim() || null,
        tool,
        class_string: classString,
        config,
        user_id: user.id,
      });
      setSaving(false);

      if (error) {
        resetSaveSession();
        showToast("Couldn't save design", false);
        return;
      }
      showToast("Design saved!");
      setReloadSignal((s) => s + 1);
    },
    [tool, showToast]
  );

  return { saving, save, reloadSignal };
}
